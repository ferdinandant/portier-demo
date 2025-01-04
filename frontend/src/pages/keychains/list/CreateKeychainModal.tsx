import { use, useEffect, useState } from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../../../components/chakra/Dialog/Dialog";
import Alert, { AlertStatus } from "../../../components/ui/Alert/Alert";
import { Field } from "../../../components/chakra/Field/Field";

type FormState = "ready" | "loading" | "done";

type Props = {
  isOpen: boolean;
  onClose?: () => any;
};

export default function CreateKeychainModal(props: Props) {
  const { isOpen, onClose } = props;

  // Form state
  const [formState, setFormState] = useState<FormState>("ready");
  const [description, setDescription] = useState("");

  // Alert state
  const [alertStatus, setAlertStatus] = useState<AlertStatus>();
  const [alertTitle, setAlertTitle] = useState<string | undefined>();
  const [alertContent, setAlertContent] = useState<any>();

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------

  const resetForm = () => {
    setFormState("ready");
    setAlertStatus(undefined);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      resetForm();
    }
  };

  const handleChangeDescription = (e: any) => {
    if (formState === "ready") {
      setDescription(e.target.value);
    }
  };

  const handleSubmit = () => {
    // Validate
    if () {
        
    }
  };

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------

  useEffect(() => {
    setAlertStatus("success");
    setAlertTitle("sudah dibikin");
    setAlertContent("tobat woy");
  }, []);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <DialogRoot size="lg" open={isOpen}>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Create new keychain</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <DialogBody>
          {alertStatus && (
            <Box mb={4}>
              <Alert
                status={alertStatus}
                title={alertTitle}
                content={alertContent}
              />
            </Box>
          )}
          <VStack alignItems="stretch" gap={4}>
            <Field label="Description" required>
              <Input
                placeholder=""
                value={description}
                onChange={handleChangeDescription}
              />
            </Field>
          </VStack>
        </DialogBody>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
