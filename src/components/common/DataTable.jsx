/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
//import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AddNewButton, { TableBackButton, TableDeleteButton } from './Buttons';
import { useNavigate } from 'react-router-dom';
//import { useTranslation } from 'react-i18next';
//import { IoInformationCircle } from "react-icons/io5";
import { SiMicrosoftexcel } from "react-icons/si";
import { MdOutlineDeleteForever } from "react-icons/md";
import { CardActions, useTheme } from '@mui/joy';
import { SnackbarCustom } from './Common';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { useTranslation } from 'react-i18next';
import LoadingPage from './LaodingPage';
import NoRecords from './NoRecords';
import { ToastContainer } from 'react-toastify';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


function getComparator(order, orderBy ) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

const stableSort = (array, comparator) => {
    // Create a shallow copy of the array with the original indices
    const stabilizedArray = array.map((el, index) => [el, index]);
    
    // Sort the shallow copy
    stabilizedArray.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      return order !== 0 ? order : a[1] - b[1];
    });
  
    // Return the sorted array without the indices
    return stabilizedArray.map(([el]) => el);
  };

function RowMenu() {
  const {t} = useTranslation();
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>{t("Edit")}</MenuItem>
        {/* <MenuItem>{t("Rename")}</MenuItem>
        <MenuItem>{t("Move")}</MenuItem> */}
        <Divider />
        <MenuItem color="danger">{t("Delete")}</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function DataTable({columns, rows, selectionFilters, pageTitle="", formUrl="", setSearch, excelExport, pages=1, currentPage=0, setCurrentPage, deleteMethod }) {
  const [order, setOrder] = React.useState('desc');
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [sortField, setSortField] = React.useState("id");
  const [loading, setLoading] = React.useState(true);

  const {t} = useTranslation();
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;

  React.useEffect(() => {
    if(rows.length > 0){
      setLoading(false);
    }
    if(loading === true){
      setTimeout(() => {
        setLoading(false);
      }
      , 1000);
    }
  }, [rows, loading]);

  const navigate = useNavigate();
  const renderFilters = () => (
    <React.Fragment>
        {selectionFilters.map((filter) => 
            <FormControl size="sm">
                <FormLabel>{t(filter.label)}</FormLabel>
                <Select
                size="sm"
                placeholder={t(filter.placeholder)}
                onChange={(event, newValue) => setSearch(newValue)}
                slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}>
                {filter.options.map((option) => <Option value={option}>{t(option)}</Option>)}
                <Option value="">{t("All")}</Option>
                </Select>
            </FormControl>
        )}
    </React.Fragment>
  );

  const handleExport = () => {
    if(!excelExport){
      setError({type:"warning", message: "Export function not implemented"});
      setOpenError(true);
      return;
    }
    if (selected.length > 0) {
      excelExport(selected);
    } else {
      excelExport(rows.map((row) => row.id));
    }
  }

  const handleSort = (field) => {
    setSortField(field);
    setOrder(order === 'asc' ? 'desc' : 'asc');
  }
  return (
    <>
    {(loading && <LoadingPage />) ||
    <div style={{ width: "95%", justifyContent: "center"}}>
        <ToastContainer autoClose={3000}/>
        {error && <SnackbarCustom type={error.type} message={error.message} open={openError} setOpen={setOpenError} />}
        <Box
            sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                mx: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                pt: { xs: 5, sm: 5 },
            }}
            >
            <Typography level="h2" component="h1">
                {t(pageTitle)}
            </Typography>
            {/* <Button
                color="primary"
                startDecorator={<DownloadRoundedIcon />}
                size="sm"
            >
                Download PDF
            </Button> */}
            <AddNewButton title={t(pageTitle)} formUrl={`${window.location.pathname}/new`} />
        </Box>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
          mx: 1,
        }}
      >
        <Input
          size="sm"
          placeholder={t("Search")}
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }} 
          onChange={(event) => setSearch(event.target.value)}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              {t("Filters")}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                {t("Apply")}
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          mx: 1,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>{t("Search for")} {t(pageTitle)}</FormLabel>
          <Input size="sm" placeholder={t("Search")} startDecorator={<SearchIcon />} onChange={(event) => setSearch(event.target.value)} />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="DataTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'flex' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
          mx: 1,
        }}
      >
        <TableBackButton />
        <Table className="table-auto table-striped"
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow 
          variant="outlined"
          sx={{
            '--TableCell-headBackground': "paper",//'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
            paddingBottom: 2,
            borderColor: 'divider',
          }}
        >
          <colgroup>
            <col style={{ width: 48 }} />
            {columns.map((column) => (
              <col style={{ width: column.width|| 120 }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <CardActions>
                <Button onClick={handleExport} size="sm" variant="contained" color="primary" 
                  startDecorator={<SiMicrosoftexcel fontSize={18} color={primaryColor}/>} sx={{
                    ':hover': {backgroundColor: "primary", opacity: 0.8},
                    mx:1, my:1
                    }}>
                    <Typography level="body-sm">{t("Export")}</Typography>
                </Button>
                {selected.length > 0 && <TableDeleteButton deleteMethod={deleteMethod} targetIds={selected} message={t("Successfully Deleted")}/>}
              </CardActions>
            </tr>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              {columns.map((column) => (column.name === "id" || column.sort)? 
              <th style={{ width: column.width||80, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => handleSort(column.name)}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  {t(column.label)}
                </Link>
              </th>
              :
              <th style={{ width: column.width||100, padding: '12px 6px' }}>{t(column.label)}</th>
                )}
                <th style={{width:120}}></th>
              
            </tr>
          </thead>
          {rows.length > 0 &&
          <tbody>
            {stableSort(rows, getComparator(order, sortField)).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>

                {columns.map((column) => (
                <td>
                    {column.special === "status" ? <StatusChip status={row[column.name]} /> :
                    column.special === "person"? <PersonBox person={{"name": row.name, "email": row.email, "image": row.image}}/>: 
                    column.special === "amount"? <Typography level="body-sm">{row[column.name] && row[column.name].toLocaleString()} {t("SAR")}</Typography>:
                    column.name === "id" || column === columns[0] ? <Typography level="body-sm"><Button variant='outlined' sx={{ border: "none", marginTop:1 }} onClick={()=>navigate(`${window.location.pathname}/${row.objectId}`)}>{row[column.name]}</Button></Typography>:
                    <Typography level="body-sm">{row[column.name]}</Typography>}
                </td>))}
                
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-sm" component="button" onClick={() => navigate(`${window.location.pathname}/${row.objectId}`)}>
                      {t("Details")}
                    </Link>
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
          ||
          <tbody>
            <tr>
              <td colSpan={columns.length + 2}>
                <NoRecords />
              </td>
            </tr>
          </tbody>
          }
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          {t("Previous")}
        </Button>

        <Box sx={{ flex: 1 }} />
        {Array.from({length: pages}, (x, i) => i).map((page) => (
          <IconButton
            key={page}
            size="sm"
            //variant={Number(page) ? 'outlined' : 'plain'}
            variant= {page === currentPage ? 'outlined' : 'contained'}
            color={page === currentPage ? 'primary': 'neutral'} 
            onClick={() => setCurrentPage(page)}
          >
            {page + 1}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />

        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          disabled={currentPage === pages - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {t("Next")}
        </Button>
      </Box>
    </div>
    }
    </>
  );
}

function StatusChip({ status }) {
  const {t} = useTranslation();
  const colors = {
    NEW: 'neutral',
    DRAFT: 'neutral',
    PAID: 'primary',
    POSTED: 'primary',
    ACTIVE: 'success',
    SENT: 'success',
    EXPIRED: 'danger',
    FAILED: 'danger',
    CANCELLED: 'warning',
    EXPIRING: 'warning',
    };
    return (
        <Chip className="border-2 shadow-sm" sx={{ borderColor: colors[status]}}
            variant="soft"
            size="sm"
            startDecorator={
                {
                    NEW: <AutoAwesomeIcon />,
                    DRAFT: <AutoAwesomeIcon />,
                    PAID: <CheckRoundedIcon />,
                    POSTED: <CheckRoundedIcon />,
                    SENT: <CheckRoundedIcon />,
                    ACTIVE: <PublishedWithChangesIcon />,
                    EXPIRED: <SyncDisabledIcon />,
                    FAILED: <BlockIcon />,
                    CANCELLED: <BlockIcon />,
                    EXPIRING: <SyncProblemIcon />,
                }[status]
            }
            color={
                {
                    NEW: 'neutral',
                    DRAFT: 'neutral',
                    PAID: 'primary',
                    POSTED: 'primary',
                    ACTIVE: 'success',
                    SENT: 'success',
                    EXPIRED: 'danger',
                    FAILED: 'danger',
                    CANCELLED: 'warning',
                    EXPIRING: 'warning',
                }[status]
            }
            >
            {t(status)}
            </Chip>
    )}

function PersonBox({person}){
    return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', wordBreak:"break-all", width:190 }}>
    <Avatar size="sm" className="w-12 h-12 rounded-full border-2 border-white shadow-lg">{(person.image && <img className='w-12 h-12 rounded-full border-2 border-white shadow-lg' src={person.image} alt="Profile" style={{width: 30, height: 30, borderRadius: 50}}/>) ||(person.name && person.name[0])}</Avatar>
    <div>
        <Typography level="body-xs">{person.name}</Typography>
        <a onClick={(e) => e.stopPropagation()} href={`mailto:${person.email}`}>
          <Typography level="body-xs">{person.email}</Typography>
        </a>
    </div>
    </Box>
    )
}