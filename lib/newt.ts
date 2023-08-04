import { cache } from 'react'
import { createClient } from 'newt-client-js'
import type { Archive, Article } from '@/types/article'
import type { Author } from '@/types/author'
import type { Tag, TagWithCount } from '@/types/tag'

const client = createClient({
  spaceUid: process.env.NEXT_PUBLIC_NEWT_SPACE_UID + '',
  token: process.env.NEXT_PUBLIC_NEWT_API_TOKEN + '',
  apiType: process.env.NEXT_PUBLIC_NEWT_API_TYPE as 'cdn' | 'api',
})

export const getApp = cache(async () => {
  const app = await client.getApp({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
  })
  return app
})

export const getArticles = cache(
  async (options?: {
    query?: Record<string, any>
    search?: string
    tag?: string
    author?: string
    year?: number
    page?: number
    limit?: number
  }) => {
    const { query, search, tag, author, year, page, limit } = options || {}
    const _query = {
      ...(query || {}),
    }
    if (search) {
      _query.or = [
        {
          title: {
            match: search,
          },
        },
        {
          body: {
            match: search,
          },
        },
      ]
    }
    if (tag) {
      _query.tags = tag
    }
    if (author) {
      _query.author = author
    }
    if (year) {
      _query['_sys.createdAt'] = {
        gte: new Date(year.toString()).toISOString(),
        lt: new Date((year + 1).toString()).toISOString(),
      }
    }
    const _page = page || 1
    const _limit = limit || Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10
    const _skip = (_page - 1) * _limit

    const { items, total } = await client.getContents<Article>({
      appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
      modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID + '',
      query: {
        depth: 2,
        limit: _limit,
        skip: _skip,
        ..._query,
      },
    })

    return {
      articles: items,
      total,
    }
  },
)

export const getPages = cache(
  async (options?: {
    tag?: string
    author?: string
    year?: number
  }): Promise<{ number: number }[]> => {
    const { total } = await getArticles(options)
    const pages = Array(
      Math.ceil(total / Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10),
    )
      .fill(true)
      .map((_, index) => ({
        number: index + 1,
      }))
    return pages
  },
)

export const getArticle = cache(async (slug: string) => {
  if (!slug) return null

  const article = await client.getFirstContent<Article>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID + '',
    query: {
      depth: 2,
      slug,
    },
  })
  return article
})

export const getPreviousArticle = cache(
  async (currentArticle: Article): Promise<{ slug: string } | null> => {
    const { createdAt } = currentArticle._sys
    const article = await client.getFirstContent<{ slug: string }>({
      appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
      modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID + '',
      query: {
        select: ['slug'],
        '_sys.createdAt': {
          gt: createdAt,
        },
        order: ['_sys.createdAt'],
      },
    })
    return article
  },
)

export const getNextArticle = cache(
  async (currentArticle: Article): Promise<{ slug: string } | null> => {
    const { createdAt } = currentArticle._sys
    const article = await client.getFirstContent<{ slug: string }>({
      appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
      modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID + '',
      query: {
        select: ['slug'],
        '_sys.createdAt': {
          lt: createdAt,
        },
        order: ['-_sys.createdAt'],
      },
    })
    return article
  },
)

export const getTags = cache(async (): Promise<{ tags: TagWithCount[] }> => {
  const { items: tags } = await client.getContents<Tag>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_TAG_MODEL_UID + '',
  })

  const { items: articles } = await client.getContents<{ tags: string[] }>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID + '',
    query: {
      depth: 0,
      select: ['tags'],
    },
  })

  const getTagCount = (tag: Tag) => {
    return articles.filter((article) => {
      return article.tags?.some((articleTag: string) => articleTag === tag._id)
    }).length
  }

  const popularTags: TagWithCount[] = tags
    .map((tag) => {
      return {
        ...tag,
        count: getTagCount(tag),
      }
    })
    .filter((tag) => {
      // 1件も記事のないタグは除外
      return tag.count > 0
    })
    .sort((a, b) => {
      return b.count - a.count
    })
    .slice(0, 10)

  return {
    tags: popularTags,
  }
})

export const getTag = cache(async (slug: string): Promise<Tag | null> => {
  if (!slug) return null

  const tag = await client.getFirstContent<Tag>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_TAG_MODEL_UID + '',
    query: {
      slug,
    },
  })
  return tag
})

export const getAuthors = cache(async () => {
  const { items: authors } = await client.getContents<Author>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_AUTHOR_MODEL_UID + '',
  })

  const { items: articles } = await client.getContents<{ author: string }>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID + '',
    query: {
      depth: 0,
      select: ['author'],
    },
  })

  const getAuthorCount = (author: Author) => {
    return articles.filter((article) => {
      return article.author === author._id
    }).length
  }

  const validAuthors = authors.filter((author) => {
    // 1件も記事のない著者は除外
    return getAuthorCount(author) > 0
  })

  return {
    authors: validAuthors,
  }
})

export const getAuthor = cache(async (slug: string): Promise<Author | null> => {
  if (!slug) return null

  const author = await client.getFirstContent<Author>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_AUTHOR_MODEL_UID + '',
    query: {
      slug,
    },
  })
  return author
})

export const getArchives = cache(async (): Promise<{ archives: Archive[] }> => {
  const { items: articles } = await client.getContents<{
    _sys: { createdAt: string }
  }>({
    appUid: process.env.NEXT_PUBLIC_NEWT_APP_UID + '',
    modelUid: process.env.NEXT_PUBLIC_NEWT_ARTICLE_MODEL_UID + '',
    query: {
      select: ['_sys.createdAt'],
    },
  })
  const oldestArticle = articles.slice(-1)[0]
  const oldestYear = new Date(oldestArticle._sys.createdAt).getFullYear()
  const currentYear = new Date().getFullYear()
  const years = Array.from(
    { length: currentYear - oldestYear + 1 },
    (_, index) => {
      return currentYear - index
    },
  )

  const getArchiveCount = (year: number) => {
    return articles.filter((article) => {
      return article._sys.createdAt.startsWith(`${year}-`)
    }).length
  }

  const archives = years
    .map((year) => {
      return {
        year,
        count: getArchiveCount(year),
      }
    })
    .filter((archive) => {
      // 1件も記事のない年は除外
      return archive.count > 0
    })

  return {
    archives,
  }
})
