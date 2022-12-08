import { Page, Layout, Card, Stack, TextContainer, TextStyle, Heading, Badge, TextField, Icon, Select, DataTable, Button, Pagination, ButtonGroup, Modal,EmptyState } from "@shopify/polaris";
import { TitleBar,useNavigationHistory  } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router";
import { SearchMajor } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { Axios } from "../Axios";
import Switch from "react-switch";
import SummaryCard from "../components/SummaryCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import {
  EditMajor, DeleteMajor
} from '@shopify/polaris-icons';
import store from "store2";
import {
  AnalyticsMajor
} from '@shopify/polaris-icons';



  
export default function UserGuide() {
  const {replace} = useNavigationHistory();
const navigate = useNavigate();
  return(
    <Page>
    <TitleBar
    breadcrumbs={[{
        content: "Dashboard",
        onAction: () => {
            navigate("/home");
            replace({pathname: '/home'});
        }
    }]}
    title="User Guide"
    secondaryActions={[
      {
        content: "Back",
        onAction: () => {
          navigate("/", {replace: true});
          replace({pathname: '/'});
        }
      },
    ]}
  />
    <Layout>
      <Layout.Section>
      <Card sectioned>
      <EmptyState
        heading="User Guide Portal"
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
      </EmptyState> 
    </Card>
      </Layout.Section>
    </Layout>
  </Page>
  );
}