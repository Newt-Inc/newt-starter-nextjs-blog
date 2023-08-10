'use client'
import { useRouter } from 'next/navigation'
import styles from '@/styles/Pagination.module.css'

export function Pagination({
  total,
  current,
  basePath,
}: {
  total: number
  current: number
  basePath: string
}) {
  const router = useRouter()

  const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10
  const maxPage = Math.ceil(total / pageSize)
  const pages = Array.from({ length: maxPage }).map((_, index) => index + 1)

  return (
    <nav className={styles.Pagination}>
      <ul className={styles.Pagination_Items}>
        {pages.map((page) => (
          <li key={page} className={styles.Pagination_Item}>
            <button
              type="button"
              className={`${styles.Pagination_Button} ${
                page === current ? styles._current : ''
              }`}
              onClick={() => router.push(`${basePath}/${page}`)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
