import Link from 'next/link'
import styles from '@/styles/Error.module.css'

export default function NotFound() {
  return (
    <div className={styles.Error}>
      <span className={styles.Error_Emoji}>😵</span>
      <h1>Page not found</h1>
      <Link href="/" className={styles.Error_Link}>
        Back to the home page
      </Link>
    </div>
  )
}
