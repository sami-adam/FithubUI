import { Typography } from "@mui/joy";
import StripePayment from "../components/common/StripePayment";
import MembershipRegistration from "../components/member/MembershipRegistration";
import { useState } from "react";

export default function HomePage() {
    const [product, setProduct] = useState('');
    const [amount, setAmount] = useState(0);
    
    return (
        <div style={{marginTop:"20px", paddingInlineStart:8}}>
            <Typography level="h2" component="h1">Subscribe</Typography>
            <br/>
            <MembershipRegistration setProduct={setProduct} setAmount={setAmount}/>
            <br/>
            <div style={{display:"flex", justifyContent:"center"}}>
                <StripePayment product={product} amount={amount}/>
            </div>
        </div>
    );
}