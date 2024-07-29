/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default function DataList({ listItems=[] , formUrl=""}) {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      {listItems.map((listItem) => (
        <List
          key={listItem.id}
          size="sm"
          sx={{
            '--ListItem-paddingX': 0,
          }}
        >
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
              <ListItemDecorator>
                <Avatar size="sm">{listItem.avatar}</Avatar>
              </ListItemDecorator>
              <div>
                <Typography fontWeight={600} gutterBottom>
                  {listItem.title}
                </Typography>
                <Typography level="body-xs" gutterBottom>
                  {listItem.subtitle}
                </Typography>
                <Box
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, mb: 1, }} >
                  <Typography level="body-xs">{listItem.firstRow[0]}</Typography>
                  <Typography level="body-xs">&bull;</Typography>
                  <Typography level="body-xs">{listItem.firstRow[1]}</Typography>
                </Box>
                {listItem.secondRow && (
                  <Box
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, mb: 1, }} >
                    <Typography level="body-xs">{listItem.secondRow[0]}</Typography>
                    <Typography level="body-xs">&bull;</Typography>
                    <Typography level="body-xs">{listItem.secondRow[1]}</Typography>
                  </Box>
                )}

                {listItem.thirdRow && (
                  <Box
                  sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, mb: 1, }} >
                    <Typography level="body-xs">{listItem.thirdRow[0]}</Typography>
                    <Typography level="body-xs">&bull;</Typography>
                    <Typography level="body-xs">{listItem.thirdRow[1]}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Link level="body-xs" component="button" onClick={() => navigate(formUrl, { state: {object: listItem.object}})}>
                      Details
                    </Link>
                  <RowMenu />
                </Box>
              </div>
            </ListItemContent>
            <StatusChip status={listItem.status} />
          </ListItem>
          <ListDivider />
        </List>
      ))}
      <Box
        className="Pagination-mobile"
        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm" mx="auto">
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

function StatusChip({ status }) {
    return (
      <Chip
      variant="soft"
      size="sm"
      startDecorator={
        {
          NEW: <AutoAwesomeIcon />,
          PAID: <CheckRoundedIcon />,
          SENT: <CheckRoundedIcon />,
          ACTIVE: <PublishedWithChangesIcon />,
          EXPIRED: <SyncDisabledIcon />,
          FAILED: <BlockIcon />,
          CANCELLED: <BlockIcon />,
        }[status] || <AutoAwesomeIcon />
      }
      color={
        {
          NEW: 'neutral',
          PAID: 'primary',
          ACTIVE: 'success',
          SENT: 'success',
          EXPIRED: 'danger',
          FAILED: 'danger',
          CANCELLED: 'warning',
        }[status] || 'neutral'
      }
    >
      {status}
    </Chip>
    )
}
