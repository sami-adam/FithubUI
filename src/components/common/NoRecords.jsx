import React from "react";
import { Box, Typography, Button } from "@mui/joy";

const NoRecords = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
      bgcolor="background.level1"
      padding={3}
      sx={{ width: "100%" }}
    >
      <Typography level="h3" color="neutral" marginBottom={2}>
        No Records Found
      </Typography>
      <Typography level="body1" color="neutral" textAlign="center" marginBottom={3}>
        There are no records available at the moment. Please try again later or add new records.
      </Typography>
      <Button
        variant="soft"
        color="primary"
        size="lg"
        onClick={() => {
          // Define the action to take when the button is clicked
          console.log("Add New Record");
        }}
      >
        Add New Record
      </Button>
    </Box>
  );
};

export default NoRecords;
