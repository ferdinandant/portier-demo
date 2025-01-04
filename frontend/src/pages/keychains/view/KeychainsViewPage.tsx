import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  Input,
  Card,
  Spinner,
  VStack,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";

// Components
import Header from "../../../components/site/Header/Header";
import Alert, { AlertStatus } from "../../../components/ui/Alert/Alert";
import SelectableCard from "../../../components/ui/SelectableCard/SelectableCard";
import Pagination from "../../../components/ui/Pagination/Pagination";
import debounce from "../../../utils/timing/debounce";
import { API_KEYCHAINS_VIEW } from "../../../constants/api";
import parseURL from "../../../utils/url/parseURL";
import { ROUTE_KEYCHAINS_VIEW } from "../../../constants/routes";
import UpdateKeychainModal from "./UpdateKeychainModal";

// Constants

// Utils

// ================================================================================
// MAIN
// ================================================================================

export default function KeychainsViewPage() {
  // Filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [debouncedFilterValue, setDebouncedFilterValue] = useState("");
  const debouncedSetDebouncedFilterValueRef = useRef(
    debounce(300, (value: string) => {
      setDebouncedFilterValue(value);
    })
  );

  // Alert state
  const [alertStatus, setAlertStatus] = useState<AlertStatus>();
  const [alertTitle, setAlertTitle] = useState<string | undefined>();
  const [alertContent, setAlertContent] = useState<any>();

  // Data state
  const [isKeychainDataLoading, setIsKeychainDataLoading] = useState(true);
  const [isKeyCopiesDataLoading, setIsKeyCopiesDataLoading] = useState(true);
  const [keychainData, setKeychainData] = useState<any>();
  const [keyCopiedData, setKeyCopiesData] = useState<any>();

  // Modal state
  const [isUpdateKeychainModalOpen, setIsUpdateKeychainModalOpen] =
    useState(false);

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------

  const fetchKeychainData = async () => {
    const errTitle = "Error fetching keychains";
    try {
      const { keychainID } = parseURL(ROUTE_KEYCHAINS_VIEW);
      const res = await fetch(API_KEYCHAINS_VIEW, {
        method: "POST",
        body: JSON.stringify({
          keychainID,
        }),
      });
      const decodedRes = await res.json();
      if (decodedRes.errors) {
        throw decodedRes.errors;
      }
      setIsKeychainDataLoading(false);
      setKeychainData(decodedRes.data);
    } catch (err) {
      const errContent = Array.isArray(err) ? err : (err as any).message;
      setIsKeychainDataLoading(false);
      setAlertStatus("error");
      setAlertTitle("Failed fetching keychain data");
      setAlertContent(errContent);
    }
  };

  const fetchKeyCopiesData = async () => {
    // const errTitle = "Error fetching keychains";
    // try {
    //   setIsLoading(true);
    //   const res = await fetch(API_KEYCHAINS_LIST, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       filter: debouncedFilterValue,
    //       page: currentPage,
    //     }),
    //   });
    //   const decodedRes = await res.json();
    //   setIsLoading(false);
    //   setData(decodedRes.data);
    //   if (decodedRes.errors) {
    //     setErrorTitle(errTitle);
    //     setErrors(decodedRes.errors);
    //   }
    // } catch (err) {
    //   const errStr = (err as any).message;
    //   setIsLoading(false);
    //   setData(null);
    //   setErrorTitle(errTitle);
    //   setErrors([errStr]);
    // }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    debouncedSetDebouncedFilterValueRef.current(e.target.value);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  // ------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------

  useEffect(() => {
    fetchKeychainData();
    fetchKeyCopiesData();
  }, []);

  // ------------------------------------------------------------
  // Renders
  // ------------------------------------------------------------

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        {alertStatus && (
          <Box mb={4}>
            <Alert
              status={alertStatus}
              title={alertTitle}
              content={alertContent}
            />
          </Box>
        )}

        {/* Keychain data section */}
        <Text mb={2} textStyle="2xl" style={{ fontWeight: 700 }}>
          Keychain data
        </Text>
        <Card.Root mb={4} variant="subtle">
          <Card.Body gap="2">
            {isKeychainDataLoading && (
              <VStack>
                <Spinner size="xl" />
              </VStack>
            )}
            {!isKeychainDataLoading && !keychainData && (
              <VStack>That keychain is not found.</VStack>
            )}
            {!isKeychainDataLoading && keychainData && (
              <VStack alignItems="stretch">
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Keychain ID</div>
                  <div>{keychainData.KeychainID}</div>
                </VStack>
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Description</div>
                  <div>{keychainData.Description}</div>
                </VStack>
                <VStack alignItems="stretch" gap={0}>
                  <div style={{ fontWeight: 700 }}>Date created</div>
                  <div>{keychainData.DateCreated}</div>
                </VStack>
              </VStack>
            )}
          </Card.Body>
          {!isKeychainDataLoading && keychainData && (
            <Card.Footer justifyContent="flex-end">
              <Button
                variant="outline"
                onClick={() => setIsUpdateKeychainModalOpen(true)}
              >
                Edit
              </Button>
              <Button colorPalette="red">Delete</Button>
            </Card.Footer>
          )}
        </Card.Root>

        {/* Filter section */}
        <Box mt={8}>
          <Text mb={2} textStyle="2xl" style={{ fontWeight: 700 }}>
            Key copies
          </Text>
          <Input
            variant="outline"
            placeholder="Filter by key ID or bearer ID ..."
            onChange={handleFilterChange}
            value={filterValue}
          />
        </Box>

        {/* Modals */}
        <UpdateKeychainModal
          keychainData={keychainData}
          isOpen={isUpdateKeychainModalOpen}
          onClose={() => setIsUpdateKeychainModalOpen(false)}
          onSuccess={() => fetchKeychainData()}
        />
      </main>
    </>
  );
}
