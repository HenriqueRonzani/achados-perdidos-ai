import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react"
import { Button, InfoIcon, Modal, toast } from "@heroui/react"
import { updateUser } from "@/app/services/api/user.service"
import CustomInput from "@/app/components/form/custom-input"
import z from "zod";

const obligatoryString = z.string().min(1, { error: 'Campo obrigatório' })

const userSchema = z.object({
  id: z.number(),
  name: obligatoryString,
  email: z.string().min(1, { error: 'Campo obrigatório' }).email({ message: 'E-mail inválido' }),
})

export type EditUserForm = z.infer<typeof userSchema>

type Props = {
  user: EditUserForm
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  onEdit: () => void
  onCancel: () => void
}

const EditUserModal = ({ user, isOpen, setIsOpen, onEdit, onCancel }: Props) => {
  const [form, setForm] = useState<EditUserForm>(user)
  const [errors, setErrors] = useState<z.ZodError["issues"] | undefined>();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async (e: SyntheticEvent) => {
    e.preventDefault();

    const validation = userSchema.safeParse(form);
    if (!validation.success) {
      setErrors(validation.error.issues);
      return;
    } else {
      setErrors(undefined)
    }

    try {
      setLoading(true)
      await updateUser(form.id, { name: form.name, email: form.email })
      setIsOpen(false)
      clearForm()
      onEdit()
      toast('Usuário editado com sucesso!', { variant: "success" })
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
            <Modal.Heading>Editar usuário</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="name"
              type="text"
              placeholder="Nome completo"
              label="Nome"
              fieldPosition="col"
            />
            <CustomInput
              formState={form}
              setForm={setForm}
              errors={errors}
              path="email"
              type="email"
              placeholder="exemplo@email.com"
              label="E-mail"
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

export default EditUserModal;
