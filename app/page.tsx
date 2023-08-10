import { ArticleCard } from '@/components/ArticleCard'
import { Cover } from '@/components/Cover'
import { Pagination } from '@/components/Pagination'
import { Side } from '@/components/Side'
import { getApp, getArticles } from '@/lib/newt'
import styles from '@/styles/ArticleList.module.css'

export default async function Page() {
  const app = await getApp()
  const { articles, total } = await getArticles({
    limit: Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
  })
  const headingText = 'Recent Articles'

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
            <Pagination total={total} current={1} basePath={'/page'} />
          </main>
          <Side />
        </div>
      </div>
    </>
  )
}
