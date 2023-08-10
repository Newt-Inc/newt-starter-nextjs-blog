import Image from 'next/image'
import Link from 'next/link'
import { getApp } from '@/lib/newt'
import styles from '@/styles/Footer.module.css'

export async function Footer() {
  const app = await getApp()

  return (
    <footer className={styles.Footer}>
      <div className={styles.Footer_Inner}>
        <Link className={styles.SiteName} href="/">
          {app.icon?.type === 'emoji' && (
            <span className={styles.SiteName_Icon}>{app.icon.value}</span>
          )}
          {app.icon?.type === 'image' && (
            <span className={styles.SiteName_Icon}>
              <Image src={app.icon.value} alt="" width="23" height="23" />
            </span>
          )}
          <div className={styles.SiteName_Text}>{app.name || app.uid}</div>
        </Link>
        <div className={styles.Link}>
          <a
            href="https://github.com/Newt-Inc/newt-starter-nextjs-blog"
            rel="noreferrer noopener"
            target="_blank"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
