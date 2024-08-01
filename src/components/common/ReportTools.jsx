import { PDFDownloadLink } from "@react-pdf/renderer";
import { RiFilePdf2Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/joy";


export default function PDFPrint({document, fileName="report", title="Download PDF", setOpen}) {
    const {t} = useTranslation();
    return (
        <div>
            <PDFDownloadLink document={document} fileName={`${t(fileName)}.pdf`} style={{textDecoration:"none"}} onClick={()=> setOpen(false)}>
            {({ blob, url, loading, error }) =>
                loading ? `${t('Loading document')}...` : <>
                <Button variant="soft" style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <RiFilePdf2Fill fontSize={18}/> <Typography style={{fontSize:"14px",paddingInlineStart:"8px"}}>{t(title)}</Typography>
                </Button>
            </>
            }
            </PDFDownloadLink>
        </div>
    )
}