import React, { ChangeEvent, useState } from "react";
import { Input, Button, HStack } from "@chakra-ui/react";

import Header from "../../../components/site/Header/Header";

export default function KeychainsListPage() {
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        {/* Filter section */}
        <section>
          <HStack>
            <Input
              variant="outline"
              placeholder="Filter by ..."
              onChange={handleFilterChange}
              value={filterValue}
            />
            <Button colorPalette="green">Create</Button>
          </HStack>
        </section>

        {/* Table section*/}
        <section></section>
      </main>
    </>
  );
}
