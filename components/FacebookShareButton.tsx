'use client'

export function FacebookShareButton() {
  const shareOnFacebook = () => {
    window.open(
      `//www.facebook.com/sharer.php?src=bm&u=${encodeURIComponent(
        window.location.href,
      )}`,
      '_blank',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600',
    )
  }

  return (
    <button type="button" aria-label="twitter" onClick={shareOnFacebook}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="#cccccc"
      >
        <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z" />
      </svg>
    </button>
  )
}
