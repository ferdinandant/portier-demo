import { useEffect, useState } from "react";
import { Box, Button, VStack, Input } from "@chakra-ui/react";
import { Link } from "react-router";

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
import {
  API_KEYCHAINS_CREATE,
  API_KEYCHAINS_UPDATE,
} from "../../../constants/api";
import substituteURL from "../../../utils/url/substituteURL";
import { ROUTE_KEYCHAINS_VIEW } from "../../../constants/routes";

type FormState = "ready" | "loading" | "done";

type Props = {
  keychainData: any;
  isOpen: boolean;
  onClose?: () => any;
  onSuccess?: () => any;
};

export default function UpdateKeychainModal(props: Props) {
  const { isOpen, onClose, onSuccess, keychainData } = props;

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
    // Reset form
    setFormState("ready");
    setAlertStatus(undefined);
    // Reset states
    if (keychainData) {
      setDescription(keychainData.Description);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      resetForm();
    }
  };

  const handleSubmit = async () => {
    if (formState !== "ready") {
      return;
    }
    try {
      // Mark loading
      setFormState("loading");
      setAlertStatus("info");
      setAlertTitle("Updating keychain ...");
      setAlertContent(null);
      // Send request
      const res = await fetch(API_KEYCHAINS_UPDATE, {
        method: "POST",
        body: JSON.stringify({
          keychainID: keychainData.KeychainID,
          description,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      } else {
        setFormState("done");
        setAlertStatus("success");
        setAlertTitle("Successfully updated the keychain");
        setAlertContent(null);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setFormState("ready");
      setAlertStatus("error");
      setAlertTitle("Failed creating a new keychain");
      setAlertContent(errContent);
    }
  };

  const handleChangeDescription = (e: any) => {
    if (formState === "ready") {
      setDescription(e.target.value);
    }
  };

  // ------------------------------------------------------------
  // Use
  // ------------------------------------------------------------

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  if (!keychainData) {
    return null;
  }

  return (
    <DialogRoot size="lg" open={isOpen}>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Update keychain</DialogTitle>
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
          {/* Form */}
          <VStack alignItems="stretch">
            <VStack alignItems="stretch" gap={4}>
              <Field label="Keychain ID" required>
                <Input
                  disabled
                  placeholder=""
                  value={keychainData.KeychainID}
                />
              </Field>
            </VStack>
            <VStack alignItems="stretch" gap={4}>
              <Field label="Description" required>
                <Input
                  placeholder=""
                  value={description}
                  onChange={handleChangeDescription}
                />
              </Field>
            </VStack>
          </VStack>
        </DialogBody>

        {/* Footer */}
        <DialogFooter>
          {formState === "done" && <Button onClick={handleClose}>Close</Button>}
          {formState !== "done" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={formState !== "ready"}>
                Update
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
