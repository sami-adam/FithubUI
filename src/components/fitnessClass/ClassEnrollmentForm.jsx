import { useLocation, useParams } from "react-router-dom";
import useClassEnrollmentStore from "../../state/classEnrollment";
import useMemberStore from "../../state/memberState";
import useFitnessClassStore from "../../state/fitnessClassState";
import useClassScheduleStore from "../../state/classScheduleState";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HorozontalStepper, Required } from "../common/Common";
import { CardContent, FormControl, FormLabel, Table, Typography } from "@mui/joy";
import FormBaseLayout, { FormFooter, FormHeader } from "../common/FormBaseLayout";
import { Fitbit, Person } from "@mui/icons-material";
import { ButtonDatePicker, ManyToOneField } from "../common/Fields";
import Input from '@mui/joy/Input';
import { NumericFormat } from "react-number-format";
import PaidIcon from '@mui/icons-material/Paid';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const stages = ["NEW", "PAID", "ACTIVE", "EXPIRED", "CANCELLED"];
export default function ClassEnrollmentForm(){
    const location = useLocation();
    const { id } = useParams();

    const [members, fetchMembers] = useMemberStore((state) => [state.members, state.fetchMembers]);
    const [fitnessClasses, fetchFitnessClasses] = useFitnessClassStore((state) => [state.fitnessClasses, state.fetchFitnessClasses]);
    const [classSchedules, fetchClassSchedules] = useClassScheduleStore((state) => [state.classSchedules, state.fetchClassSchedules]);

    const updateClassEnrollment = useClassEnrollmentStore((state) => state.updateClassEnrollment);
    const addClassEnrollment = useClassEnrollmentStore((state) => state.addClassEnrollment);
    const deleteClassEnrollment = useClassEnrollmentStore((state) => state.deleteClassEnrollment);
    const fetchClassEnrollment = useClassEnrollmentStore((state) => state.fetchClassEnrollment);
    const [classEnrollment, setClassEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchData, setFetchData] = useState(true);
    const {t} = useTranslation();
    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');

    const [member, setMember] = useState(null);
    const [fitnessClass, setFitnessClass] = useState(null);
    const [classSchedule, setClassSchedule] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [price, setPrice] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(null);
    const [taxAmount, setTaxAmount] = useState(null);
    const [netAmount, setNetAmount] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !classEnrollment && id !== 'new'){
          fetchClassEnrollment(id).then((res) => {
            if(res.success){
                setClassEnrollment(res.data);
            } else {
                Swal.fire({
                    title: t(res.error.message),
                    text: t(res.error.details),
                    icon: 'error',
                    confirmButtonText: t('OK')
                });
            }
            setLoading(false);
          });
        }
        if(!classEnrollment){
            setStartDate(dayjs());
            setEndDate(dayjs());
        }
        if(classEnrollment){
            setMember(member => member || classEnrollment.member);
            setFitnessClass(fitnessClass => fitnessClass || classEnrollment.fitnessClass);
            setClassSchedule(classSchedule => classSchedule || classEnrollment.classSchedule);
            setStartDate(startDate => dayjs(classEnrollment.startDate));
            setEndDate(endDate => dayjs(classEnrollment.endDate));
            setPrice(price => price || classEnrollment.price);
            setDiscountAmount(discountAmount => discountAmount || classEnrollment.discountAmount);
            setTaxAmount(taxAmount => taxAmount || classEnrollment.taxAmount);
            setNetAmount(netAmount => netAmount || classEnrollment.netAmount);
            setStatus(status => status || classEnrollment.status);
        }
        if(mode !== 'view' && fetchData){
            fetchMembers();
            fetchFitnessClasses();
            fetchClassSchedules();
            setFetchData(false);
        }
    }, [mode, id, classEnrollment, fetchData, fetchMembers, fetchFitnessClasses, fetchClassSchedules, fetchClassEnrollment]);

    const validateFields = [
        { type: "other", value: member, message: "Please select a member" },
        { type: "other", value: fitnessClass, message: "Please select a fitness class" },
        { type: "other", value: classSchedule, message: "Please select a class schedule" }
    ]

    const addFields = {
        member: member && {"id": member.id},
        fitnessClass: fitnessClass && {"id": fitnessClass.id},
        classSchedule: classSchedule && {"id": classSchedule.id},
    }

    const updateFields = {
        id: typeof id === 'string' && id !== 'new' ? id : classEnrollment?.id,
        member: member && {"id": member.id},
        fitnessClass: fitnessClass && {"id": fitnessClass.id},
        classSchedule: classSchedule && {"id": classSchedule.id},
    }

    return (
        <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
        <FormHeader loading={loading} title="Enrollment Information" mode={mode} setMode={setMode} deleteMethod={deleteClassEnrollment} updateMethod={updateClassEnrollment} updateFields={updateFields} addMethod={addClassEnrollment} addFields={addFields} validateFields={validateFields} stateStore={useClassEnrollmentStore}>
            <HorozontalStepper stages={stages} currentStage={(stages.indexOf(classEnrollment&&classEnrollment.status)||0)} />
        </FormHeader>
        <FormBaseLayout loading={loading}>
        <CardContent
            sx={{
            display: 'grid',
            paddingTop: 2,
            gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
            gap: 1.5,
            }}>
            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<Person sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Member")}</Typography></FormLabel>
                <ManyToOneField options={members} optionsFields={["firstName", "lastName"]} value={member} setValue={setMember} mode={mode} url={"/members"}/>
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<Fitbit sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Fitness Class")}</Typography></FormLabel>
                <ManyToOneField options={fitnessClasses} optionsFields={["name"]} value={fitnessClass} setValue={setFitnessClass} mode={mode} url={"/fitness-classes"}/>
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<Fitbit sx={{ fontSize: 18}}/>} endDecorator={<Required/>}>{t("Class Schedule")}</Typography></FormLabel>
                <ManyToOneField options={classSchedules} optionsFields={["reference"]} value={classSchedule} setValue={setClassSchedule} mode={mode} url={"/class-schedules"}/>
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<PaidIcon sx={{ fontSize: 18}}/>}>{t("Price")}</Typography></FormLabel>
                <NumericFormat 
                value={price&&price.toLocaleString()}
                thousandSeparator
                customInput={Input} 
                startDecorator={<Typography variant="body2">{t("SAR")}</Typography>}
                disabled 
                sx={{ border: 'none' }}
            />
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<CalendarMonthIcon sx={{ fontSize: 18}}/>}>{t("Start Date")}</Typography></FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ButtonDatePicker 
                    label={startDate == null ? null : startDate.format('MM/DD/YYYY')}
                    value={startDate}
                    disabled
                    />
                </LocalizationProvider>
            </FormControl>

            <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
                <FormLabel><Typography level='body-sm' startDecorator={<CalendarMonthIcon sx={{ fontSize: 18}}/>}>{t("End Date")}</Typography></FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <ButtonDatePicker 
                    label={endDate == null ? null : endDate.format('MM/DD/YYYY')}
                    value={endDate}
                    disabled
                    />
                </LocalizationProvider>
            </FormControl>

        </CardContent>
        </FormBaseLayout>

        <FormFooter loading={loading}>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
        <Table variant="outlined" sx={{ borderRadius: 8, borderColor: "divider", width: '100%', mt: 1 }}>
            <tbody>
            {[
                { label: "Subtotal", value: price && price.toLocaleString() },
                { label: "Taxes", value: taxAmount && taxAmount.toLocaleString() },
                { label: "Discount", component: (
                <NumericFormat
                    value={discountAmount && discountAmount.toLocaleString()}
                    thousandSeparator
                    customInput={Input} 
                    sx={{fontSize: 'inherit' }}
                    onChange={(e) => setDiscountAmount(e.target.value.replace(',', ''))}
                    disabled={mode === 'view'}
                />
                )},
                //{ label: "Total", value: total && total.toLocaleString() }
            ].map(({ label, value, component }, index) => (
                <tr key={index}>
                <td style={{ width: 120, padding: '8px 16px', border: "none"}}>{t(label)}</td>
                <td style={{ border: "none", padding: '8px 16px' }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ paddingInlineEnd: 1.5 }}>{t("SAR")}</Typography>
                    {component || <Typography variant="body2">{value}</Typography>}
                    </div>
                </td>
                </tr>
            ))}
        
            </tbody>
        </Table>

            </FormControl>
        </FormFooter>
        </div>

    );

}