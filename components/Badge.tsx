import Image from 'next/image'
import styles from '@/styles/Badge.module.css'

export function Badge() {
  return (
    <a
      href="https://newt.so/"
      rel="noreferrer noopener"
      target="_blank"
      className={styles.Badge}
    >
      <Image src="/logo.svg" alt="Newt" width="16" height="13" />
      <span className={styles.Badge_Text}>Made in Newt</span>
    </a>
  )
}
