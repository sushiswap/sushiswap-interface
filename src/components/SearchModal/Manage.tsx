import React, { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

import Column from "../Column";
import CurrencyModalView from "./CurrencyModalView";
import ManageLists from "./ManageLists";
import ManageTokens from "./ManageTokens";
import ModalHeader from "../ModalHeader";
import { Token } from "@sushiswap/sdk";
import { TokenList } from "@uniswap/token-lists";
import styled from "styled-components";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";

const ContentWrapper = styled(Column)`
  height: 100%;
  width: 100%;
  flex: 1 1;
  position: relative;
  overflow-y: hidden;
`;

function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  onDismiss: () => void;
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const { i18n } = useLingui();

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <ContentWrapper>
      <ModalHeader
        onClose={onDismiss}
        title={i18n._(t`Manage`)}
        onBack={() => setModalView(CurrencyModalView.search)}
      />
      <Tabs
        forceRenderTabPanel
        selectedIndex={tabIndex}
        onSelect={(index: number) => setTabIndex(index)}
        className="flex flex-col flex-grow"
      >
        <TabList className="flex flex-shrink-0 p-1 rounded bg-dark-800">
          <Tab
            className="flex items-center justify-center flex-1 px-1 py-2 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
            selectedClassName="bg-dark-900 text-high-emphesis"
          >
            {i18n._(t`Lists`)}
          </Tab>
          <Tab
            className="flex items-center justify-center flex-1 px-1 py-2 text-lg rounded cursor-pointer select-none text-secondary hover:text-primary focus:outline-none"
            selectedClassName="bg-dark-900 text-high-emphesis"
          >
            {i18n._(t`Tokens`)}
          </Tab>
        </TabList>
        <TabPanel style={{ flexGrow: 1 }}>
          <ManageLists
            setModalView={setModalView}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        </TabPanel>
        <TabPanel style={{ flexGrow: 1 }}>
          <ManageTokens
            setModalView={setModalView}
            setImportToken={setImportToken}
          />
        </TabPanel>
      </Tabs>
    </ContentWrapper>
  );
}

export default Manage;
