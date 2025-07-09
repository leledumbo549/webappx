function Footer() {
  return (
    <footer className="py-4 border-t text-center text-sm text-gray-500">
      <small>
        commit {__COMMIT_HASH__}: {__COMMIT_MSG__}
      </small>
    </footer>
  )
}

export default Footer
