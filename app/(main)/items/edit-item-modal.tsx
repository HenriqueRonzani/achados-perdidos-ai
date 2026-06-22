import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react"
import { AddItemForm } from "./add-item-modal"
import { Button, InfoIcon, Modal, toast } from "@heroui/react"
import { updateItem } from "@/app/services/api/item.service"
import CustomInput from "@/app/components/form/custom-input"
import z from "zod";

const obligatoryString = z.string().min(1, { error: 'Campo obrigatório' })

const itemSchema = z.object({
  id: z.number(),
  name: obligatoryString,
  description: obligatoryString,
  location: obligatoryString
})

export type EditItemForm = z.infer<typeof itemSchema>

type Props = {
  item: EditItemForm
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onEdit: () => void
  onCancel: () => void
}

const EditItemModal = ({ item, isOpen, setIsOpen, onEdit, onCancel }: Props) => {
    const [form, setForm] = useState<EditItemForm>(item)
    const [errors, setErrors] = useState<z.ZodError["issues"] | undefined>();
    const [loading, setLoading] = useState(false);


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

            await updateItem(form.id, form)

            setIsOpen(false)
            clearForm()
            onEdit()

            toast('Item editado com sucesso!', {variant: "success"})
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error?.message : "Houve um erro";
            toast(errorMessage, { variant: "danger" })
        } finally {
            setLoading(false)
        }
    }

    const clearForm = () => {
        onCancel()
    }

    return (
     <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger onClick={clearForm} isDisabled={loading} />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <InfoIcon className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Editar item</Modal.Heading>
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

          </Modal.Body>
          <Modal.Footer>
            <div className="w-full flex flex-row justify-between">
              <Button onClick={clearForm} slot="close" variant="danger-soft" isDisabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} isDisabled={loading} isPending={loading}>
                Salvar
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

export default EditItemModal;