'use client'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import styles from '@/styles/Pagination.module.css'

export function Pagination({
  total = 0,
  current = 1,
  basePath = '',
}: {
  total?: number
  current?: number
  basePath?: string
}) {
  const router = useRouter()
  const pages = useMemo(() => {
    return Array(
      Math.ceil(total / (Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10)),
    )
      .fill({ number: 0, isCurrent: false })
      .map((value, index) => {
        const pageNumber = index + 1
        return {
          ...value,
          number: pageNumber,
          isCurrent: current === pageNumber,
        }
      })
  }, [total, current])

  return (
    <nav className={styles.Pagination}>
      <ul className={styles.Pagination_Items}>
        {pages.map((page) => (
          <li key={page.number} className={styles.Pagination_Item}>
            <button
              type="button"
              className={`${styles.Pagination_Button} ${
                page.isCurrent ? styles._current : ''
              }`}
              onClick={() => router.push(`/${basePath}/${page.number}`)}
            >
              {page.number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
