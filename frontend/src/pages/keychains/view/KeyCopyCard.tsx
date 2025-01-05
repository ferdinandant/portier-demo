import React, { useState } from "react";
import { BsFillKeyFill } from "react-icons/bs";
import { Card, VStack, Box, Button, Text, HStack } from "@chakra-ui/react";

import UpdateCopyModal from "./UpdateCopyModal";

type Props = {
  keyCopyData: any;
  onRequestUpdate?: () => any;
  onRequestDelete?: () => any;
};

export default function KeyCopyCard(props: Props) {
  const { keyCopyData, onRequestUpdate, onRequestDelete } = props;
  const { KeyID, DateCreated, StaffID, StaffName } = keyCopyData;
  const hasAssignedStaff = StaffID.Valid;

  const handleClickUpdate = () => {
    onRequestUpdate && onRequestUpdate();
  };

  const handleClickDelete = () => {
    onRequestDelete && onRequestDelete();
  };

  return (
    <>
      <Card.Root width={"full"}>
        <Box p={4}>
          <HStack alignItems="start">
            <div>
              <BsFillKeyFill size={48} />
            </div>

            <VStack gap={1} alignItems="stretch" flexGrow={1}>
              {/* Title */}
              <div>
                <Text textStyle="lg" style={{ width: "100%", fontWeight: 600 }}>
                  {KeyID}
                </Text>
                <div style={{ color: "#334155" }}>Created at {DateCreated}</div>
              </div>
              {/* Details */}
              <div
                style={{
                  color: "#64748b",
                  backgroundColor: "#f1f5f9",
                  borderRadius: 4,
                  paddingInline: 8,
                  paddingBlock: 4,
                }}
              >
                {hasAssignedStaff ? (
                  <>
                    {StaffID.Valid && StaffID.String} (
                    {StaffName.Valid && StaffName.String})
                  </>
                ) : (
                  <i
                    style={{
                      fontStyle: "italic",
                      color: "#cbd5e1",
                    }}
                  >
                    Unassigned
                  </i>
                )}
              </div>
              {/* Buttons */}
              <HStack pt={2} justifyContent="flex-end">
                <Button size="xs" variant="subtle" onClick={handleClickUpdate}>
                  Assign/unassign bearer
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  colorPalette="red"
                  onClick={handleClickDelete}
                >
                  Delete
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </Card.Root>
    </>
  );
}
