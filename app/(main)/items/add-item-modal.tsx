import CustomInput from "@/app/components/form/custom-input";
import { addItem, uploadImage } from "@/app/services/api/item.service";
import { Button, IconPlus, Modal, toast } from "@heroui/react"
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useState } from "react"
import z from "zod";

const obligatoryString = z.string().min(1, { error: 'Campo obrigatório' })

const itemSchema = z.object({
  name: obligatoryString,
  description: obligatoryString,
  location: obligatoryString,
  image_url: obligatoryString
})

export type AddItemForm = z.infer<typeof itemSchema>

const initialForm: AddItemForm = {
  name: '',
  description: '',
  location: '',
  image_url: ''
}


type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onAdd: () => void
}

const AddItemModal = ({ isOpen, setIsOpen, onAdd }: Props) => {
  const [form, setForm] = useState<AddItemForm>(initialForm)
  const [errors, setErrors] = useState<z.ZodError["issues"] | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      setForm((prev) => ({ ...prev, image_url: file.name }));
    }
  };

  const handleConfirm = async (e: SyntheticEvent) => {
    e.preventDefault();

    const validation = itemSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    } else {
      setErrors(undefined)
    }

    try {
      setLoading(true)
      let imageUrl = form.image_url

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile)

        const uploadResponse = await uploadImage(formData)

        imageUrl = uploadResponse.url;
      }

      await addItem({
        ...form,
        image_url: imageUrl
      })

      setIsOpen(false)
      clearForm()
      onAdd()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error?.message : "Houve um erro";
      toast(errorMessage, { variant: "danger" })
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setForm(initialForm);
    setSelectedFile(null);
  }

  const imageError = errors?.find((err) => err.path[0] === 'image_url')?.message;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger onClick={clearForm} isDisabled={loading} />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <IconPlus className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Registrar novo item</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="name"
              type="text"
              placeholder="Nome"
              label="Nome"
              fieldPosition="col"
            />
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="description"
              type="text"
              placeholder="Descrição"
              label="Descrição"
              fieldPosition="col"
            />
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="location"
              type="text"
              placeholder="Local onde foi encontrado"
              label="Local onde objeto foi encontrado"
              fieldPosition="col"
            />

            <div className="flex flex-col gap-1 w-full py-2">
              <label className="text-sm font-medium text-default-600">
                Imagem do Item
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-default-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-default-100 file:text-default-700
                  hover:file:bg-default-200 file:cursor-pointer"
              />
              {imageError && (
                <p className="text-xs font-medium text-danger pl-1">
                  {imageError}
                </p>
              )}
            </div>

          </Modal.Body>
          <Modal.Footer>
            <div className="w-full flex flex-row justify-between">
              <Button onClick={clearForm} slot="close" variant="danger-soft" isDisabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} isDisabled={loading} isPending={loading}>Salvar</Button>
            </div>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

export default AddItemModal;
