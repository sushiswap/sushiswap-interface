export default function Dots({ children = '' }) {
  return (
    <>
      <style jsx>
        {`
          .dots::after {
            content: '.';
          }
        `}
      </style>
      <span className="after:inline-block dots after:animate-ellipsis after:w-4 after:text-left">{children}</span>
    </>
  )
}
