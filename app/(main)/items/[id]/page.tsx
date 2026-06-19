
type Props = {
  params: Promise<{ id: string }>
}

const ItemPage = async ({ params }: Props) => {
  const { id } = await params

  return (
    <main>
      Pagina de conteudo do item de id {id}
    </main>
  )
}

export default ItemPage
