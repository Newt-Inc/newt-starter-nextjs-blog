import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { Pagination } from '@/components/Pagination'
import { Side } from '@/components/Side'
import { getArticles, getAuthors, getAuthor } from '@/lib/newt'
import styles from '@/styles/ArticleList.module.css'

type Props = {
  params: {
    slug: string
    page?: string[]
  }
}

export async function generateStaticParams() {
  const authors = await getAuthors()
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10

  const params: { slug: string; page?: string[] }[] = []
  await authors.reduce(async (prevPromise, author) => {
    await prevPromise

    const { total } = await getArticles({
      author: author._id,
    })
    const maxPage = Math.ceil(total / limit)
    const pages = Array.from({ length: maxPage }, (_, index) => index + 1)

    params.push({
      slug: author.slug,
      page: undefined,
    })
    pages.forEach((page) => {
      params.push({
        slug: author.slug,
        page: [page.toString()],
      })
    })
  }, Promise.resolve())
  return params
}
export const dynamicParams = false

export default async function Page({ params }: Props) {
  const { slug, page: _page } = params
  const page = Number(_page) || 1

  const author = await getAuthor(slug)
  if (!author) {
    notFound()
  }
  const headingText = `Articles by ${author.fullName}`

  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10
  const { articles, total } = await getArticles({
    author: author._id,
    limit,
    skip: limit * (page - 1),
  })

  return (
    <div className={styles.Container}>
      <div className={styles.Container_Inner}>
        <main className={styles.Articles}>
          <div className={styles.Articles_Inner}>
            <h2 className={styles.Articles_Heading}>{headingText}</h2>
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          <Pagination
            total={total}
            current={page}
            basePath={`/authors/${slug}`}
          />
        </main>
        <Side />
      </div>
    </div>
  )
}
