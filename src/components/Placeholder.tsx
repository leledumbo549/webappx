interface Props {
  role: string
  name: string
}

function Placeholder({ role, name }: Props) {
  return (
    <div className="p-10 text-center space-y-2">
      <h2 className="text-2xl font-bold">
        {role} - {name}
      </h2>
      <p className="text-gray-500">Replace this page with real content.</p>
    </div>
  )
}

export default Placeholder
