import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Input,
  Typography,
  List,
  ListItem,
  Divider,
} from '@mui/joy';

const SupportPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 4,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          boxShadow: 'md',
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Typography level="h4">Support</Typography>
          <Typography level="body2">How can we assist you?</Typography>
        </Box>
        <CardContent>
          <Typography level="h6" gutterBottom>
            Contact Us
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
            }}
          >
            <Input
              label="Name"
              placeholder="Enter your name"
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Input
              label="Message"
              placeholder="Enter your message"
              multiline
              rows={4}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="solid" fullWidth>
              Submit
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

          <Typography level="h6" gutterBottom>
            FAQs
          </Typography>
          <List>
            <ListItem>
              <Box>
                <Typography level="body1" fontWeight="bold">
                  How do I reset my password?
                </Typography>
                <Typography level="body2">
                  To reset your password, click on 'Forgot Password' on the login page and follow the instructions.
                </Typography>
              </Box>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <Box>
                <Typography level="body1" fontWeight="bold">
                  How do I contact customer support?
                </Typography>
                <Typography level="body2">
                  You can contact us through the form above or email us at support@fitnesshub.com.
                </Typography>
              </Box>
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <Box>
                <Typography level="body1" fontWeight="bold">
                  What are your support hours?
                </Typography>
                <Typography level="body2">
                  Our support team is available 24/7 to assist you with any inquiries.
                </Typography>
              </Box>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SupportPage;
