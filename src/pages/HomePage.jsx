import { Typography } from "@mui/joy";
import StripePayment from "../components/common/StripePayment";
import SubscriptionSelection from "../components/subscription/SubscriptionSelection";

export default function HomePage() {
    
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <Typography level="h2" component="h1">Subscribe</Typography>
            <br/>
            <SubscriptionSelection />
            <br/>
            <div style={{display:"flex", justifyContent:"center"}}>
                <StripePayment />
            </div>
        </div>
    );
}