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
import FormBaseLayout from '../common/FormBaseLayout';
import { ManyToOneField } from '../common/Fields';

export default function ClassScheduleForm() {
    const location = useLocation();
    const [fitnessClasses, fetchFitnessClasses] = useFitnessClassStore((state) => [state.fitnessClasses, state.fetchFitnessClasses]);
    const [instructors, fetchInstructors] = useEmployeeStore((state) => [state.employees, state.fetchEmployees]);
    const updateClassSchedule = useClassScheduleStore((state) => state.updateClassSchedule);
    const addClassSchedule = useClassScheduleStore((state) => state.addClassSchedule);
    const deleteClassSchedule = useClassScheduleStore((state) => state.deleteClassSchedule);
    const fetchClassSchedule = useClassScheduleStore((state) => state.fetchClassSchedule);
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
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snack, setSnack] = useState({type: 'success', title: '', message: ''});
    
    const stages = ["NEW", "PLANNED", "RUNNING", "FINISHED", "CANCELLED"];

    useEffect(() => {
        if(mode === 'add'){
          setLoading(false);
        }
        if(id && mode !== 'add' && !classSchedule){
            fetchClassSchedule(id).then((data) => {
                setClassSchedule(data);
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

    const handleSave = () => {
       updateClassSchedule({
            id: classSchedule.id,
            fitnessClass: fitnessClass && {id: fitnessClass.id},
            instructor: instructor && {id: instructor.id},
            startDate: startDate,
            endDate: endDate,
            price: price,
            status: status
        });
        setMode('view');
        setSnack({type: 'success', title: 'Success', message: 'Class Schedule updated successfully'});
        setOpenSnackbar(true);
    }

    const handleAdd = () => {
        addClassSchedule({
            fitnessClass: fitnessClass && {id: fitnessClass.id},
            instructor: instructor && {id: instructor.id},
            startDate: startDate,
            endDate: endDate,
            price: price,
            status: "NEW"
        });
        setMode('view');
        setSnack({type: 'success', title: 'Success', message: 'Class Schedule added successfully'});
        setOpenSnackbar(true);
    }

    const handelDelete = () => {
        const confirm = window.confirm("Are you sure you want to delete this class schedule?");

        if(confirm){
            deleteClassSchedule(classSchedule.id);
            setMode('view');
            setSnack({type: 'success', title: 'Success', message: 'Class Schedule deleted successfully'});
            setOpenSnackbar(true);
            window.history.back();
        }
    }

    return (
      <FormBaseLayout loading={loading}>
      <HorozontalStepper stages={stages} currentStage={(stages.indexOf(classSchedule&&classSchedule.status)||0)} />
      <SnackbarCustom open={openSnackbar} setOpen={setOpenSnackbar} type={snack.type} title={snack.title} message={snack.message} />
      {/* <Divider inset="none" /> */}
      <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingTop:0}}>
        <div style={{display:"flex", flexDirection:"row"}}>
          <Typography level="title-md">
          {(classSchedule&&classSchedule.reference)|| t("New Class Schedule")}
          </Typography>
        
        </div>
        <div style={{ display: "flex", flexDirection:"row"}}>
          <Button variant='soft' startDecorator={<BiEdit fontSize={20}/>} onClick={()=> setMode("edit")} sx={{display: mode === 'view'? 'flex': 'none'}}>{t("EDIT")}</Button>
          <Button variant='soft' startDecorator={<BsSave fontSize={20}/>} onClick={handleSave} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("SAVE")}</Button>
          <Box flexGrow={1} width={4}/>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={()=> setMode("view")} sx={{display: mode === 'edit'? 'flex': 'none'}}>{t("DISCARD")}</Button>
          <Button variant='soft' startDecorator={<Add fontSize='20px'/>} onClick={handleAdd} sx={{display: mode === 'add'? 'flex': 'none'}}>{t("ADD")}</Button>
          <Button variant='soft' color='danger' startDecorator={<IoTrashBinOutline fontSize={20}/>} onClick={handelDelete} sx={{display: mode === 'view' && classSchedule? 'none': 'none'}}>{t("DELETE")}</Button>
        </div>
        
      </div>
      {/* <Divider inset="none" /> */}
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
    );

}


