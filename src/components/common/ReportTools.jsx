import { PDFDownloadLink } from "@react-pdf/renderer";
import { FaRegFilePdf } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { Typography } from "@mui/joy";


export default function PDFPrint({document, fileName="report", title="Download PDF"}) {
    const theme = useTheme();
    const primaryMainColor = theme.palette.primary.main;
    const {t} = useTranslation();
    return (
        <div>
            <PDFDownloadLink document={document} fileName={`${t(fileName)}.pdf`} style={{textDecoration:"none"}}>
            {({ blob, url, loading, error }) =>
                loading ? `${t('Loading document')}...` : <>
                <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                    <FaRegFilePdf color={primaryMainColor}/> <Typography style={{color:"gray",fontSize:"14px",paddingInlineStart:"8px"}}>{t(title)}</Typography>
                </div>
            </>
            }
            </PDFDownloadLink>
        </div>
    )
}