import useClassScheduleStore from '../../state/classScheduleState';
import useFitnessClassStore from '../../state/fitnessClassState';
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Box, Button, CardContent, FormControl, FormLabel, Input, Typography } from '@mui/joy';
import { Add } from '@mui/icons-material';
import { BiEdit } from "react-icons/bi";
import { IoTrashBinOutline } from "react-icons/io5";
import { BsSave } from "react-icons/bs";
import dayjs from 'dayjs';
import { HorozontalStepper, SnackbarCustom } from '../common/Common';
import { useTranslation } from 'react-i18next';
import useEmployeeStore from '../../state/employeeState';
import { NumericFormat } from 'react-number-format';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import EventIcon from '@mui/icons-material/Event';
import PaymentsIcon from '@mui/icons-material/Payments';
import FormBaseLayout, { FormHeader } from '../common/FormBaseLayout';
import { ManyToOneField } from '../common/Fields';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Swal from 'sweetalert2';

export default function ClassScheduleForm() {
    const location = useLocation();
    const [fitnessClasses, fetchFitnessClasses] = useFitnessClassStore((state) => [state.fitnessClasses, state.fetchFitnessClasses]);
    const [instructors, fetchInstructors] = useEmployeeStore((state) => [state.employees, state.fetchEmployees]);
    const updateClassSchedule = useClassScheduleStore((state) => state.updateClassSchedule);
    const addClassSchedule = useClassScheduleStore((state) => state.addClassSchedule);
    const deleteClassSchedule = useClassScheduleStore((state) => state.deleteClassSchedule);
    const fetchClassSchedule = useClassScheduleStore((state) => state.fetchClassSchedule);
    const enrollMember = useClassScheduleStore((state) => state.enrollMember);
    const [classSchedule, setClassSchedule] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState((location.state && location.state.viewMode) ||'view');
    const [fetchData, setFetchData] = useState(true);

    const [fitnessClass, setFitnessClass] = useState(null);
    const [instructor, setInstructor] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [price, setPrice] = useState(null);
    const [status, setStatus] = useState(null);

    const {t} = useTranslation();
    const { id } = useParams();

    
    const stages = ["NEW", "PLANNED", "RUNNING", "FINISHED", "CANCELLED"];

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !classSchedule && id !== 'new'){
            fetchClassSchedule(id).then((res) => {
                if(res.success){
                  setClassSchedule(res.data);
                }
                if(res.error){
                  Swal.fire({
                    icon: 'error',
                    title: t(res.error.message),
                    text: t(res.error.details),
                  });
                }
            }).finally(() => setLoading(false));
        }
        if(fetchData){
            fetchFitnessClasses();
            fetchInstructors();
            setFetchData(false);
        }
        if(classSchedule){
            setFitnessClass(fitnessClass=>fitnessClass||classSchedule.fitnessClass);
            setInstructor(instructor=>instructor||classSchedule.instructor);
            setStartDate(startDate=>dayjs(startDate||classSchedule.startDate));
            setEndDate(endDate=>dayjs(endDate||classSchedule.endDate));
            setPrice(price=>price||classSchedule.price);
            setStatus(status=>status||classSchedule.status);
        }
      }
    , [mode, classSchedule, fetchData, fetchFitnessClasses, fetchInstructors, id, fetchClassSchedule]);

    const validateFields = [
      {type: "other", value: fitnessClass, message: t("Please select a fitness class")},
      {type: "other", value: instructor, message: t("Please select an instructor")},
      {type: "other", value: startDate, message: t("Please select a start date")},
      {type: "other", value: endDate, message: t("Please select an end date")},
      {type: "other", value: price, message: t("Please enter a price")},
    ]

    const updateFields = {
      id: typeof id === 'string' && id !== 'new' ? id : classSchedule && classSchedule.id,
      fitnessClass: fitnessClass && {id: fitnessClass.id},
      instructor: instructor && {id: instructor.id},
      startDate: startDate,
      endDate: endDate,
      price: price,
      status: status
    }

    const addFields = {
      fitnessClass: fitnessClass && {id: fitnessClass.id},
      instructor: instructor && {id: instructor.id},
      startDate: startDate,
      endDate: endDate,
      price: price,
      status: "NEW"
    }

    const handleEnroll = () => {
      const respose = enrollMember(classSchedule && classSchedule.id);
      if(respose.success){
          Swal.fire({
              icon: 'success',
              title: 'Success',
              text: t('Member enrolled successfully!'),
          });
      }
      else {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: t('Failed to enroll member!'),
          });
      }
    }

    return (
      <div style={{ display: "flex", flexDirection:"column", width:"100%"}}>
        <FormHeader loading={loading} title="Class Schedule" mode={mode} setMode={setMode} validateFields={validateFields} updateFields={updateFields} addFields={addFields} updateMethod={updateClassSchedule} addMethod={addClassSchedule} deleteMethod={deleteClassSchedule} >
        <HorozontalStepper stages={stages} currentStage={(stages.indexOf(classSchedule&&classSchedule.status)||0)} />
        {/* <Divider inset="none" /> */}
        <Button variant='soft' onClick={handleEnroll} startDecorator={<LibraryAddIcon />}
        sx={{
          display: classSchedule && classSchedule.status === 'NEW'? 'flex': 'none',
          width: '10%',
          mt: 4
          }}>
          {t("ENROLL")}
        </Button>
        </FormHeader>
      <FormBaseLayout loading={loading}>
      <CardContent
        sx={{
          display: 'grid',
          paddingTop: 2,
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<CollectionsBookmarkIcon sx={{ fontSize: 18}}/>}>{t("Fitness Class")}</Typography></FormLabel>
          <ManyToOneField options={fitnessClasses} optionsFields={["name"]} value={fitnessClass} setValue={setFitnessClass} mode={mode} url='/fitness-classes' />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<CoPresentIcon sx={{ fontSize: 18}}/>}>{t("Instructor")}</Typography></FormLabel>
          <ManyToOneField options={instructors} optionsFields={["name"]} value={instructor} setValue={setInstructor} mode={mode} url='/employees' />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<EventIcon sx={{ fontSize: 18}}/>}>{t("Start Date")}</Typography></FormLabel>
          <Input 
            type='date'
            id="startDate"
            label={t("Start Date")}
            disabled={mode === 'view'}
            value={startDate? startDate.format('YYYY-MM-DD') : ''}
            onChange={(e) => setStartDate(dayjs(e.target.value))}
            required 
            slotProps={{
                input: {
                min: dayjs(new Date()).format('YYYY-MM-DD'),
                //max: '2018-06-14',
                },
            }}
            sx={{
                '& input': {
                display: 'flex',
                justifyContent: 'flex-end',
                }
            }}
            />
        </FormControl>
        <FormControl sx={{gridColumn: { xs: '1/-1', md: '2/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<EventIcon sx={{ fontSize: 18}}/>}>{t("End Date")}</Typography></FormLabel>
          <Input 
            type='date'
            id="endDate"
            label={t("End Date")}
            disabled={mode === 'view'}
            value={endDate? endDate.format('YYYY-MM-DD') : ''}
            onChange={(e) => setEndDate(dayjs(e.target.value))}
            required
            slotProps={{
                input: {
                min: startDate? startDate.format('YYYY-MM-DD') : dayjs(new Date()).format('YYYY-MM-DD'),
                //max: '2018-06-14',
                },
            }}
            sx={{
                '& input': {
                display: 'flex',
                justifyContent: 'flex-end',
                }
            }}

            />
        </FormControl>

        <FormControl sx={{gridColumn: { xs: '1/-1', md: '1/2' }}}>
          <FormLabel><Typography level='h5' startDecorator={<PaymentsIcon sx={{ fontSize: 18 }} fill='text.secondary'/>}>{t("Price")}</Typography></FormLabel>
          <NumericFormat
            value={price&&price.toLocaleString()}
            //thousandSeparator
            customInput={Input} 
            startDecorator={<Typography variant="body2">{t("SAR")}</Typography>} 
            sx={{ border: 'none' }}
            onChange={(e) => setPrice(e.target.value)}
            disabled={mode === 'view'}
          />
        </FormControl>

        </CardContent>

      </FormBaseLayout>
      </div>
    );

}


