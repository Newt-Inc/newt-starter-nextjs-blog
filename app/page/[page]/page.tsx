import { ArticleCard } from '@/components/ArticleCard'
import { Cover } from '@/components/Cover'
import { Pagination } from '@/components/Pagination'
import { Side } from '@/components/Side'
import { getApp, getArticles } from '@/lib/newt'
import styles from '@/styles/ArticleList.module.css'

type Props = {
  params: {
    page: string
  }
}

export async function generateStaticParams() {
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10

  const { total } = await getArticles()
  const maxPage = Math.ceil(total / limit)
  const pages = Array.from({ length: maxPage }, (_, index) => index + 1)

  return pages.map((page) => ({
    page: page.toString(),
  }))
}
export const dynamicParams = false

export default async function Page({ params }: Props) {
  const { page: _page } = params
  const page = Number(_page) || 1

  const app = await getApp()
  const headingText = 'Recent Articles'

  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10
  const { articles, total } = await getArticles({
    limit,
    skip: limit * (page - 1),
  })

  return (
    <>
      {app.cover?.value && <Cover />}
      <div className={styles.Container}>
        <div className={styles.Container_Inner}>
          <main className={styles.Articles}>
            <div className={styles.Articles_Inner}>
              <h2 className={styles.Articles_Heading}>{headingText}</h2>
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
            <Pagination total={total} current={page} basePath={'/page'} />
          </main>
          <Side />
        </div>
      </div>
    </>
  )
}
