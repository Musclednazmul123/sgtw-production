import "@shopify/polaris/build/esm/styles.css";
import { Card, Heading, Page } from "@shopify/polaris";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";
import CreateOffer from "./pages/CreateOffer";
import ShowOffer from "./pages/ShowOffer";
import Offers from "./pages/Offers";
import RecommendedProducts from "./pages/RecommendedProducts";
import FrequentlyBought from "./pages/FrequentlyBought";
import CreateFrequently from "./pages/CreateFrequently";
import ShowFrequentlyBought from "./pages/ShowFrequentlyBought";
import RecentlyView from "./pages/RecentlyView";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import UserGuide from "./pages/UserGuide";
import Installation from "./pages/Installation";
import Templates from "./pages/Templates";
import PostPurchase from "./pages/PostPurchase";
import CreatePostPurchase from "./pages/CreatePostPurchase";
import ShowPostPurchase from "./pages/ShowPostPurchase";


export default function Router() {
    return (
      <Routes> 
          <Route
            index element={<Home />}   
          />
          <Route
            path="/home" element={<Home />} 
          />
          <Route
            path="/offers" element={<Offers />}
          />
          <Route
            path="/recommended-products" element={<RecommendedProducts />}
          />
            <Route
            path="/frequently-bought/create" element={<CreateFrequently />}
          />
          <Route
            path="/frequently-bought" element={<FrequentlyBought />}
          />
          <Route
            path="/recently-view" element={<RecentlyView />} 
          />
          <Route
            path="/settings" element={<Settings />}
          />       
          <Route
            path="/frequently-bought/edit/:id" element={<CreateFrequently method="edit" />}
          />
          <Route 
            path="/frequently-bought/show/:uid" element={<ShowFrequentlyBought method="edit" />}
          />
          <Route
            path="/offers/create" element={<CreateOffer />}
          />
          <Route
            path="/offers/show/:uid" element={<ShowOffer method="edit" />}
          />
          <Route
            path="/offers/edit/:id" element={<CreateOffer method="edit" />}
          />
          <Route
            path="/post-purchase" element={<PostPurchase />}    
          />
          <Route
            path="/bundles/create/post-purchase" element={<CreatePostPurchase />}
          />
          <Route
            path="/post_purchase/edit/:id" element={<CreatePostPurchase method="edit" />} 
          />
          <Route
            path="/post-purchase/show/:uid" element={<ShowPostPurchase method="edit" />}
          />
          <Route
            path="/support" element={<Support />} 
          />
           <Route
            path="/templates" element={<Templates />} 
          />
          <Route
            path="/faq" element={<FAQ />}    
          />
          <Route
            path="/user-guide" element={<UserGuide />}    
          />
          <Route
            path="/payments" element={<Payments />}    
          />
          <Route
            path="/installation" element={<Installation />}    
          />
          <Route
            path="/pricing" element={<Payments />}    
          />
          <Route
            path="*" element={<NoMatch />} 
          />
      </Routes>
    );
}

function NoMatch() {
    return (
        <Page>
          <Card sectioned>
            <Heading>404! Page not found</Heading>
            <p>The page you have requested is not found</p>
          </Card>
        </Page>
    );
}   