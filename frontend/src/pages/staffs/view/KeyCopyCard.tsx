import React from "react";
import { BsFillKeyFill } from "react-icons/bs";
import { Card, VStack, Box, Button, Text, HStack } from "@chakra-ui/react";

type Props = {
  keyCopyData: any;
  onRequestDisassociate?: () => any;
};

export default function KeyCopyCard(props: Props) {
  const { keyCopyData, onRequestDisassociate } = props;
  const { KeyID, KeychainID, KeychainDescription } = keyCopyData;

  const handleClickDisassociate = () => {
    onRequestDisassociate && onRequestDisassociate();
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
              </div>
              {/* Details */}
              <div>From keychain:</div>
              <div
                style={{
                  color: "#64748b",
                  backgroundColor: "#f1f5f9",
                  borderRadius: 4,
                  paddingInline: 8,
                  paddingBlock: 4,
                }}
              >
                <p>{KeychainID}</p>
                <p>{KeychainDescription}</p>
              </div>
              {/* Buttons */}
              <HStack pt={2} justifyContent="flex-end">
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={handleClickDisassociate}
                >
                  Disassociate
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </Card.Root>
    </>
  );
}
