import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { Pagination } from '@/components/Pagination'
import { Side } from '@/components/Side'
import { getArticles, getArchives } from '@/lib/newt'
import styles from '@/styles/ArticleList.module.css'

type Props = {
  params: {
    year: string
    page?: string[]
  }
}

export async function generateStaticParams() {
  const archives = await getArchives()
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10

  const params: { year: string; page?: string[] }[] = []
  await archives.reduce(async (prevPromise, archive) => {
    await prevPromise

    const { total } = await getArticles({
      '_sys.createdAt': {
        gte: archive.year.toString(),
        lt: (archive.year + 1).toString(),
      },
    })
    const maxPage = Math.ceil(total / limit)
    const pages = Array.from({ length: maxPage }, (_, index) => index + 1)

    params.push({
      year: archive.year.toString(),
      page: undefined,
    })
    pages.forEach((page) => {
      params.push({
        year: archive.year.toString(),
        page: [page.toString()],
      })
    })
  }, Promise.resolve())
  return params
}
export const dynamicParams = false

export default async function Page({ params }: Props) {
  const { year: _year, page: _page } = params
  const page = Number(_page) || 1

  const year = Number(_year)
  if (Number.isNaN(year)) {
    notFound()
  }
  const headingText = `Articles in ${year}`

  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10
  const { articles, total } = await getArticles({
    '_sys.createdAt': {
      gte: year.toString(),
      lt: (year + 1).toString(),
    },
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
            basePath={`/archives/${year}`}
          />
        </main>
        <Side />
      </div>
    </div>
  )
}
