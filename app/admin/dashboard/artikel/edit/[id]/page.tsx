import EditArtikelForm from "./EditArtikelForm";

export const instant = false;

export default async function EditArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditArtikelForm id={id} />;
}