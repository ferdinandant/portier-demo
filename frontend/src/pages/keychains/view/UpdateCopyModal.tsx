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
import { API_KEYCHAINS_CREATE } from "../../../constants/api";
import substituteURL from "../../../utils/url/substituteURL";
import { ROUTE_KEYCHAINS_VIEW } from "../../../constants/routes";

type FormState = "ready" | "loading" | "done";

type Props = {
  isOpen: boolean;
  onClose?: () => any;
  onSuccess?: () => any;
  keyCopyData: any;
};

export default function UpdateCopyModal(props: Props) {
  const { isOpen, onClose, onSuccess, keyCopyData } = props;

  // Form state
  const [formState, setFormState] = useState<FormState>("ready");
  const [staffID, setStaffID] = useState("");

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
    if (keyCopyData) {
      setStaffID(keyCopyData.StaffID.String);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      resetForm();
    }
  };

  const handleChangeStaffID = (e: any) => {
    if (formState === "ready") {
      setStaffID(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (formState !== "ready") {
      return;
    }
    // try {
    //   // Mark loading
    //   setFormState("loading");
    //   setAlertStatus("info");
    //   setAlertTitle("Creating a new keychain ...");
    //   setAlertContent(null);
    //   // Send request
    //   const res = await fetch(API_KEYCHAINS_CREATE, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       description,
    //     }),
    //   });
    //   const decodedRes = await res.json();
    //   if (decodedRes.errors) {
    //     throw decodedRes.errors;
    //   } else {
    //     const keychainID = decodedRes.data.KeychainId;
    //     const href = substituteURL(ROUTE_KEYCHAINS_VIEW, { keychainID });
    //     setFormState("done");
    //     setAlertStatus("success");
    //     setAlertTitle("Successfully created a new keychain");
    //     setAlertContent(
    //       <p>
    //         You can see the newly created keychain{" "}
    //         <Link to={href} style={{ textDecoration: "underline" }}>
    //           here
    //         </Link>
    //         .
    //       </p>
    //     );
    //   }
    // } catch (err) {
    //   const errContent = Array.isArray(err) ? err : (err as any).message;
    //   setFormState("ready");
    //   setAlertStatus("error");
    //   setAlertTitle("Failed creating a new keychain");
    //   setAlertContent(errContent);
    // }
  };

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  if (!keyCopyData) {
    return;
  }

  return (
    <DialogRoot size="lg" open={isOpen}>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Update key copy</DialogTitle>
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
            <Field label="Key ID" required>
              <Input disabled placeholder="" value={keyCopyData.KeyID} />
            </Field>
            <Field label="Staff ID" required>
              <Input
                placeholder=""
                value={staffID}
                onChange={handleChangeStaffID}
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
                Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
