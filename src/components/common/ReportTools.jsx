import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaFilePdf } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Button, Typography, useTheme } from "@mui/joy";


export default function PDFPrint({document, fileName="report", title="Download PDF", setOpen}) {
    const {t} = useTranslation();
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;
    return (
        <div>
            <PDFDownloadLink document={document} fileName={`${t(fileName)}.pdf`} style={{textDecoration:"none"}} onClick={()=> setOpen(false)}>
            {({ blob, url, loading, error }) =>
                loading ? `${t('Loading document')}...` : <>
                <Button variant="soft" style={{display:"flex", flexDirection:"row", alignItems:"center"}} startDecorator={<FaFilePdf fontSize={24} color={primaryColor}/>}>
                    <Typography style={{fontSize:"14px",paddingInlineStart:"8px"}}>{t(title)}</Typography>
                </Button>
            </>
            }
            </PDFDownloadLink>
        </div>
    )
}