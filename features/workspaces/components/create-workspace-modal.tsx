"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { UseCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";
import { CreateWorkspaceForm } from "./create-workspace-form";

export const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen, close } = UseCreateWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancelForm={close} />
    </ResponsiveModal>
  );
};
