import Link from 'next/link'
import { htmlToText } from 'html-to-text'
import { getArticles } from '@/lib/newt'
import styles from '@/styles/Search.module.css'

type Props = {
  searchParams: {
    q?: string
  }
}

export default async function Page({ searchParams }: Props) {
  const { q } = searchParams

  const { articles, total } = q
    ? await getArticles({
        or: [
          {
            title: { match: q },
          },
          {
            body: { match: q },
          },
        ],
      })
    : { articles: [], total: 0 }

  return (
    <main className={styles.Container}>
      {articles.length > 0 ? (
        <div className={styles.Search}>
          <p className={styles.Search_Text}>
            Found {total} results for your search
          </p>
          <div className={styles.Search_Results}>
            {articles.map((article) => (
              <article key={article._id} className={styles.Article}>
                <Link
                  className={styles.Article_Link}
                  href={`/articles/${article.slug}`}
                >
                  <h1 className={styles.Article_Title}>{article.title}</h1>
                  <p className={styles.Article_Description}>
                    {htmlToText(article.body, {
                      selectors: [{ selector: 'img', format: 'skip' }],
                    })}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.Empty}>
          <div className={styles.Empty_Emoji}>😵</div>
          <h1 className={styles.Empty_Title}>Nothing found</h1>
          <p className={styles.Empty_Description}>
            Sorry, but nothing matched search terms…
            <br />
            Please try again with different keywords!
          </p>
        </div>
      )}
    </main>
  )
}
