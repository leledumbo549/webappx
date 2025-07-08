function Footer() {
  return (
    <footer className="py-4 text-center text-gray-500">
      <small>
        commit {__COMMIT_HASH__}: {__COMMIT_MSG__}
      </small>
    </footer>
  )
}

export default Footer
