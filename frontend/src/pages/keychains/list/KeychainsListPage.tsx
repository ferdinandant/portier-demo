import React from "react";
import { Input } from "@chakra-ui/react";

import Header from "../../../components/site/Header/Header";

export default function KeychainsListPage() {
  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        {/* Filter section */}
        <section>
          <Input variant="outline" placeholder="Filter by ..." />
        </section>

        {/* Table section*/}
        <section></section>
      </main>
    </>
  );
}
