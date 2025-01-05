import { useState } from "react";
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
import { API_KEYCHAINS_CREATE } from "../../../constants/api";
import substituteURL from "../../../utils/url/substituteURL";
import { ROUTE_KEYCHAINS_VIEW } from "../../../constants/routes";

type FormState = "ready" | "loading" | "done";

type Props = {
  isOpen: boolean;
  onClose?: () => any;
  onSuccess?: () => any;
};

export default function CreateKeychainModal(props: Props) {
  const { isOpen, onClose, onSuccess } = props;

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
    setDescription("");
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

  const handleSubmit = async () => {
    if (formState !== "ready") {
      return;
    }
    try {
      // Mark loading
      setFormState("loading");
      setAlertStatus("info");
      setAlertTitle("Creating a new keychain ...");
      setAlertContent(null);
      // Send request
      const res = await fetch(API_KEYCHAINS_CREATE, {
        method: "POST",
        body: JSON.stringify({
          description,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      } else {
        const keychainID = decodedRes.data.KeychainId;
        const href = substituteURL(ROUTE_KEYCHAINS_VIEW, { keychainID });
        setFormState("done");
        setAlertStatus("success");
        setAlertTitle("Successfully created a new keychain");
        setAlertContent(
          <p>
            You can see the newly created keychain{" "}
            <Link to={href} style={{ textDecoration: "underline" }}>
              here
            </Link>
            .
          </p>
        );
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
          {formState === "done" && <Button onClick={handleClose}>Close</Button>}
          {formState !== "done" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={formState !== "ready"}>
                Create
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
