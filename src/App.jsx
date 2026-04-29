import { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Menu,
  MenuItem,
  Stack,
  Chip,
  AppBar,
  Toolbar,
  Divider,
  ListItemIcon
} from '@mui/material'
import {
  Add as AddIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  AttachFile as AttachFileIcon,
  UploadFile as UploadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  MoreHoriz as MoreHorizIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  ChevronRight as ChevronRightIcon,
  SupportAgent as SupportAgentIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material'

const drawerWidth = 280
const navDrawerWidth = 240

function App() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [expandedClients, setExpandedClients] = useState({})
  const [selectedClient, setSelectedClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [quoteStatus, setQuoteStatus] = useState('Draft')
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const [currentApp, setCurrentApp] = useState('quick-quote')
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleAttachFile = () => {
    handleClose()

    if (currentStep === 0) {
      // First file upload
      setMessages([{
        type: 'user',
        text: 'User attached "Justin\'s client data po history.xlsx"',
        timestamp: '03:06 PM'
      }])

      setTimeout(() => {
        setIsThinking(true)
      }, 500)

      setTimeout(() => {
        setIsThinking(false)
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Great. I\'ve done this this and this. Some validation may be needed to generate your preview quote',
          timestamp: '03:06 PM'
        }])
        setCurrentStep(1) // Show first decision card
      }, 3500)
    } else if (currentStep === 2) {
      // Second file upload (updated file)
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'User attached "Justin\'s client data po history (updated).xlsx"',
        timestamp: '03:07 PM'
      }])

      setTimeout(() => {
        setIsThinking(true)
      }, 500)

      setTimeout(() => {
        setIsThinking(false)
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Great, there\'s some minor validation that\'s still left.',
          timestamp: '03:07 PM'
        }])
        setCurrentStep(3) // Show second decision card
      }, 2500)
    } else if (currentStep === 8) {
      // HTML reupload after quote generation
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'User attached "JustinsQuote.HTML"',
        timestamp: '03:10 PM'
      }])

      setTimeout(() => {
        setIsThinking(true)
      }, 500)

      setTimeout(() => {
        setIsThinking(false)
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Processing HTML file and comparing against original quote...',
          timestamp: '03:10 PM'
        }])

        // Show success message with changes detected
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'system',
            text: 'File Successfully Uploaded — 5 Fields Changed from Original',
            timestamp: '03:10 PM',
            isSuccess: true,
            changes: [
              'Updated inbound rate for Louisville, KY: $850 → $875',
              'Updated fuel surcharge tier 1 threshold: 1.2% → 1.5%',
              'Updated CVS case picking rate: $0.37 → $0.40',
              'Updated storage rate (57"+ pallets): $15.00 → $15.50',
              'Updated total shipment count: 117 → 118'
            ],
            showFinalizeButton: true
          }])
          // Stay at step 8 to allow multiple reuploads
        }, 1500)
      }, 2500)
    }
  }

  const toggleClient = (clientId) => {
    setExpandedClients(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }))
  }

  const handleDecisionButton1 = () => {
    // Archive the decision with summary
    setCurrentStep(2)
    setMessages(prev => [...prev, {
      type: 'system',
      text: 'User was informed that weight data was missing in rows 122 and 129, and had several options to choose from.',
      timestamp: '03:06 PM',
      isArchive: true
    }])

    setTimeout(() => {
      // User's response
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'I will provide the updated excel',
        timestamp: '03:06 PM'
      }])

      // System acknowledgment
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Great. I will wait until you\'ve uploaded a new file.',
          timestamp: '03:06 PM'
        }])
      }, 500)
    }, 300)
  }

  const handleDecisionButton2 = () => {
    // User chooses "Exclude This Data And Continue"
    setCurrentStep(2)
  }

  const handleDecision2Button1 = () => {
    // User chooses "Treat As CWT (114 LBS)"
    setCurrentStep(4) // Hide Decision Card 2 immediately
    setMessages(prev => [...prev, {
      type: 'system',
      text: 'User was informed that row 125 had a weight unit ambiguity and had several options to choose from.',
      timestamp: '03:07 PM',
      isArchive: true
    }])

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'Treat as CWT (114 LBS)',
        timestamp: '03:07 PM'
      }])

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Perfect. I\'ve updated the weight calculation.',
          timestamp: '03:07 PM'
        }])

        // Show thinking indicator
        setTimeout(() => {
          setIsThinking(true)

          // After thinking, show final preview with pricing factors
          setTimeout(() => {
            setIsThinking(false)
            setMessages(prev => [...prev, {
              type: 'system',
              text: 'Your file processed successfully — 117 shipments across 4 retailers. Before I build the quote, let me explain the pricing factors and customer analysis.',
              timestamp: '03:08 PM'
            }])
            setCurrentStep(7) // Show preview card
          }, 2000)
        }, 800)
      }, 500)
    }, 300)
  }


  const handleDecision2Button2 = () => {
    // User chooses "Keep As Is (1.14 LBS)"
    setCurrentStep(4)
  }

  const handleGenerateQuote = () => {
    // User clicks "Generate Quote"
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Generate quote',
      timestamp: '03:09 PM'
    }])

    // Update status to Pending Review
    setQuoteStatus('Pending Review')

    // Open the HTML quote in a new tab
    window.open('/quote-preview.html', '_blank')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'system',
        text: 'Quote Preview Is Generating — Review the HTML in the new tab. If you need to update prices, tell me the changes here and I will generate a new HTML. Otherwise, click "Finalize Quote" below if all details are correct.',
        timestamp: '03:09 PM',
        isHeadsUp: true,
        showFinalizeButton: true
      }])
      setCurrentStep(8)
    }, 500)
  }

  const handleFinalizeQuote = () => {
    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Finalize quote',
      timestamp: '03:10 PM'
    }])

    setQuoteStatus('Finalized')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'system',
        text: 'Perfect! Your quote has been finalized and is ready for delivery. The quote has been saved and you can access it anytime from the sidebar.',
        timestamp: '03:10 PM'
      }])
      setCurrentStep(9)
    }, 500)
  }

  // Mock data for chat history
  const clients = [
    { id: 1, name: 'Bragg Live Food Products', quoteCount: 23, quotes: ['Quote 1234', 'Quote 1235', 'Quote 1236'] },
    { id: 2, name: 'Trove Brands LLC', quoteCount: 15, quotes: [] },
    { id: 3, name: 'WHIRLYBIRD GRANOLA', quoteCount: 8, quotes: [] },
    { id: 4, name: 'AB WORLD FOODS US, INC.', quoteCount: 31, quotes: [] },
    { id: 5, name: 'Delta Carbona LP', quoteCount: 12, quotes: [] },
    { id: 6, name: 'Flagstone Foods LLC', quoteCount: 19, quotes: [] },
    { id: 7, name: 'Brothers International Food LLC', quoteCount: 7, quotes: [] },
    { id: 8, name: 'OLIVE PACKING COMPANY', quoteCount: 42, quotes: [] },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fafafa' }}>
      {/* Top App Bar with Hamburger Menu */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important', px: 2 }}>
          <IconButton
            edge="start"
            onClick={() => setNavDrawerOpen(true)}
            sx={{ mr: 2, color: '#666' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>
            {currentApp === 'insight-analytics' ? 'Insight Analytics' : 'Quick Quote'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={navDrawerOpen}
        onClose={() => setNavDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: navDrawerWidth,
            bgcolor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Drive Applications Header */}
          <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#666', fontSize: '11px', fontWeight: 500 }}>
              Drive Applications
            </Typography>
          </Box>

          <Divider />

          {/* Navigation Links */}
          <List sx={{ py: 0, flexGrow: 1 }}>
            <ListItem
              button
              onClick={() => {
                setCurrentApp('quick-quote')
                setNavDrawerOpen(false)
              }}
              sx={{
                py: 1.5,
                bgcolor: currentApp === 'quick-quote' ? 'rgba(0, 68, 106, 0.12)' : 'transparent',
                borderLeft: currentApp === 'quick-quote' ? '4px solid #00446A' : '4px solid transparent',
                '&:hover': { bgcolor: 'rgba(0, 68, 106, 0.08)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DashboardIcon sx={{ color: currentApp === 'quick-quote' ? '#00446A' : '#666' }} />
              </ListItemIcon>
              <ListItemText
                primary="Quick Quote"
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: currentApp === 'quick-quote' ? 600 : 400,
                  color: currentApp === 'quick-quote' ? '#00446A' : '#666'
                }}
              />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setCurrentApp('insight-analytics')
                setNavDrawerOpen(false)
              }}
              sx={{
                py: 1.5,
                bgcolor: currentApp === 'insight-analytics' ? 'rgba(0, 68, 106, 0.12)' : 'transparent',
                borderLeft: currentApp === 'insight-analytics' ? '4px solid #00446A' : '4px solid transparent',
                '&:hover': { bgcolor: 'rgba(0, 68, 106, 0.08)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AssessmentIcon sx={{ color: currentApp === 'insight-analytics' ? '#00446A' : '#666' }} />
              </ListItemIcon>
              <ListItemText
                primary="Insight Analytics"
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: currentApp === 'insight-analytics' ? 600 : 400,
                  color: currentApp === 'insight-analytics' ? '#00446A' : '#666'
                }}
              />
            </ListItem>
          </List>

          <Divider />

          {/* User Resources Section */}
          <Box>
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '11px', fontWeight: 500 }}>
                User Resources
              </Typography>
            </Box>

            <List sx={{ py: 0 }}>
              <ListItem
                button
                sx={{
                  py: 1.5,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SupportAgentIcon sx={{ color: '#666', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Get Customer Support"
                  primaryTypographyProps={{
                    fontSize: '13px',
                    color: '#333'
                  }}
                />
                <ChevronRightIcon sx={{ color: '#999', fontSize: 18 }} />
              </ListItem>
              <ListItem
                button
                sx={{
                  py: 1.5,
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon sx={{ color: '#666', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Impersonate User"
                  primaryTypographyProps={{
                    fontSize: '13px',
                    color: '#333'
                  }}
                />
                <ChevronRightIcon sx={{ color: '#999', fontSize: 18 }} />
              </ListItem>
            </List>

            <Divider sx={{ my: 1 }} />

            {/* User Info */}
            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccountCircleIcon sx={{ color: '#666', fontSize: 32 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>
                  Emma Eshler
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666' }}>
                  eeshler@insight2profit.com
                </Typography>
              </Box>
            </Box>

            {/* Logout Button */}
            <Box sx={{ px: 2, pb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#1976d2',
                  textTransform: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  py: 1,
                  '&:hover': {
                    bgcolor: '#1565c0'
                  }
                }}
              >
                LOGOUT
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Sidebar - Only show for Quick Quote */}
        {currentApp === 'quick-quote' && (
        <Drawer
          variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            borderRight: '1px solid #e0e0e0'
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '14px' }}>
              Chat History
            </Typography>
            <IconButton size="small">
              <SearchIcon fontSize="small" />
            </IconButton>
          </Box>

          {currentApp === 'quick-quote' && (
            <>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ChatIcon />}
                sx={{
                  bgcolor: '#00446A',
                  textTransform: 'none',
                  mb: 3,
                  py: 1,
                  '&:hover': {
                    bgcolor: '#003350'
                  }
                }}
              >
                NEW CHAT
              </Button>

              <List sx={{ p: 0 }}>
                {clients.map((client) => (
              <Box key={client.id}>
                <ListItem
                  button
                  onClick={() => toggleClient(client.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  {expandedClients[client.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  <ListItemText
                    primary={client.name}
                    primaryTypographyProps={{ fontSize: '14px', ml: 1 }}
                  />
                  <Box
                    sx={{
                      bgcolor: '#e0e0e0',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {client.quoteCount}
                  </Box>
                </ListItem>
                <Collapse in={expandedClients[client.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {client.quotes.map((quote, idx) => (
                      <ListItem
                        key={idx}
                        button
                        sx={{
                          pl: 4,
                          py: 0.5,
                          '&:hover': {
                            bgcolor: '#f5f5f5'
                          }
                        }}
                      >
                        <ListItemText
                          primary={quote}
                          primaryTypographyProps={{ fontSize: '13px' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
            </>
          )}
        </Box>
      </Drawer>
        )}

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {currentApp === 'insight-analytics' ? (
          // Insight Analytics - Client Scorecard
          <Box sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f5f5f5',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <Box sx={{
              p: 2,
              bgcolor: 'white',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                Client Scorecard & Opportunities
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#666' }}
                >
                  Refresh
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#666' }}
                >
                  Export
                </Button>
              </Box>
            </Box>

            {/* Content */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
              {/* Top Opportunity Cards */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                <Box sx={{ bgcolor: 'white', p: 2.5, borderRadius: 1, border: '1px solid #e0e0e0', borderLeft: '4px solid #f57c00' }}>
                  <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
                    Margin Improvement
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f57c00', mt: 1, mb: 0.5 }}>
                    $127K
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                    5 clients priced below market average
                  </Typography>
                </Box>

                <Box sx={{ bgcolor: 'white', p: 2.5, borderRadius: 1, border: '1px solid #e0e0e0', borderLeft: '4px solid #1976d2' }}>
                  <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
                    Walmart Push
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2', mt: 1, mb: 0.5 }}>
                    8 Clients
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                    Low Walmart % with potential to increase
                  </Typography>
                </Box>

                <Box sx={{ bgcolor: 'white', p: 2.5, borderRadius: 1, border: '1px solid #e0e0e0', borderLeft: '4px solid #d32f2f' }}>
                  <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
                    LTL Rate Issues
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#d32f2f', mt: 1, mb: 0.5 }}>
                    3 Clients
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '13px' }}>
                    Priced below LTL benchmark rates
                  </Typography>
                </Box>
              </Box>

              {/* Client Scorecard Table */}
              <Box sx={{ bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Client Performance & AI Insights
                  </Typography>
                </Box>
                <Box sx={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e0e0e0', background: '#fafafa' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>CLIENT</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#666' }}>ANNUAL REVENUE</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#666' }}>MARGIN %</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#666' }}>WALMART %</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#666' }}>LTL DELTA</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666' }}>AI INSIGHTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Justin</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$585,768</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>12.3%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>8%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#d32f2f', fontWeight: 600 }}>-$42</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Margin 3.2% below similar clients (avg 15.5%). Opportunity: +$18.7K annually"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                            <Box
                              title="Walmart volume at 8% vs business avg 23%. Potential to increase shipments by introducing Walmart-specific rates"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                            <Box
                              title="Priced $42/shipment below LTL benchmark. Risk: underpriced service, recommend rate adjustment"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#ffebee',
                                border: '2px solid #d32f2f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#d32f2f'
                              }}
                            >
                              L
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Bragg Live Food</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$892,450</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>16.8%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>12%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$15</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Walmart at 12% but trending down. Suggest proactive outreach to maintain volume"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Trove Brands LLC</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$1,245,880</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>11.2%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>18%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$8</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Margin 4.3% below peer average. High volume client - small rate increase = $53K opportunity"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>WHIRLYBIRD GRANOLA</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$324,560</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>17.5%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>5%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$22</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Only 5% Walmart volume. Client profile matches high-performing Walmart shippers - expansion opportunity"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>AB WORLD FOODS</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$1,567,230</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>10.8%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>6%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#d32f2f', fontWeight: 600 }}>-$55</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Margin significantly below benchmark. Large revenue base makes this a priority renegotiation"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                            <Box
                              title="Walmart penetration extremely low at 6%. Target for business development team"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                            <Box
                              title="Priced $55/shipment below LTL rates. Highest priority for rate correction"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#ffebee',
                                border: '2px solid #d32f2f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#d32f2f'
                              }}
                            >
                              L
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Nature's Path Foods</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$2,145,900</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>18.2%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>31%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$35</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>✓ Healthy</Typography>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>KULI KULI FOODS</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$456,280</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>13.1%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>9%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$12</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Margin at 13.1% is below 15.5% average. Growing client with room for optimization"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                            <Box
                              title="Walmart at only 9%. Fast-growing brand that could benefit from Walmart expansion"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Simple Mills</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$3,892,400</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>19.3%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>14%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$42</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Strong margin but Walmart at 14% vs potential 25%+. Large revenue = significant opportunity"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Good Health Brands</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$734,560</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>11.7%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>22%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#d32f2f', fontWeight: 600 }}>-$28</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Margin below peer group despite good Walmart mix. Rate adjustment recommended"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                            <Box
                              title="Priced $28/shipment below LTL benchmark despite healthy volume"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#ffebee',
                                border: '2px solid #d32f2f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#d32f2f'
                              }}
                            >
                              L
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>LESSER EVIL</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$1,678,200</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>17.1%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>28%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$18</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>✓ Healthy</Typography>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Hippeas</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$542,890</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>12.8%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>7%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>-$3</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Margin 2.7% below average. Medium revenue client with upside potential"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                            <Box
                              title="Walmart at only 7%. High-growth snack brand ideal for Walmart expansion"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Made Good Foods</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$1,923,450</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>16.4%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>25%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$28</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>✓ Healthy</Typography>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Hu Kitchen</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$687,340</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>10.2%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>4%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>+$5</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Lowest margin in portfolio at 10.2%. Premium brand should support higher pricing"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                            <Box
                              title="Walmart penetration critically low at 4%. Major expansion opportunity"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Tia Lupita Foods</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$298,750</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>18.9%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>11%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$31</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Good margin but Walmart at 11% - emerging brand could benefit from focused push"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Partake Foods</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$823,190</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#f57c00', fontWeight: 600 }}>13.5%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>10%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#d32f2f', fontWeight: 600 }}>-$18</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Margin 2% below average for allergen-free category. Rate review needed"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#fff3e0',
                                border: '2px solid #f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#f57c00'
                              }}
                            >
                              M
                            </Box>
                            <Box
                              title="Walmart at 10% but trending. Allergen-free products perform well at Walmart"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                            <Box
                              title="LTL pricing $18 below benchmark. Correct before volume scales"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#ffebee',
                                border: '2px solid #d32f2f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#d32f2f'
                              }}
                            >
                              L
                            </Box>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Chomps</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$2,567,800</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>20.1%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#666', fontWeight: 600 }}>35%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$48</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>✓ Healthy</Typography>
                          </Box>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontWeight: 500 }}>Purely Elizabeth</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>$1,234,670</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>15.8%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#1976d2', fontWeight: 600 }}>13%</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span style={{ color: '#4caf50', fontWeight: 600 }}>+$21</span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Box
                              title="Walmart at 13% with room to grow. Granola category performs well at Walmart"
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: '#e3f2fd',
                                border: '2px solid #1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'help',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1976d2'
                              }}
                            >
                              W
                            </Box>
                          </Box>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </Box>

              {/* AI Insights Legend */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 1 }}>
                  AI INSIGHT FLAGS (hover for details)
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#fff3e0', border: '2px solid #f57c00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#f57c00' }}>M</Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Margin Opportunity</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#e3f2fd', border: '2px solid #1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#1976d2' }}>W</Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Walmart Growth Potential</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#ffebee', border: '2px solid #d32f2f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#d32f2f' }}>L</Box>
                    <Typography variant="caption" sx={{ color: '#666' }}>Below LTL Rates</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          // Quick Quote App
          <>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #e0e0e0',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Justin's IL Consolidation Program
            </Typography>
            <IconButton size="small" sx={{ color: '#666' }}>
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Chip
              label={quoteStatus}
              size="small"
              sx={{
                bgcolor: quoteStatus === 'Draft' ? '#e0e0e0' : '#fff3cd',
                color: quoteStatus === 'Draft' ? '#666' : '#856404',
                fontWeight: 500,
                fontSize: '12px'
              }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => setSelectedClient(selectedClient ? null : 'Justins')}
            startIcon={currentStep === 0 && !selectedClient ? (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#ffc107',
                  animation: 'pulse 2s infinite'
                }}
              />
            ) : null}
            endIcon={selectedClient ? <EditIcon /> : null}
            sx={{
              bgcolor: '#00446A',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#003350'
              },
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1
                },
                '50%': {
                  opacity: 0.5
                }
              }
            }}
          >
            {selectedClient ? `Client: ${selectedClient}` : 'SELECT CLIENT'}
          </Button>
        </Box>

        {/* Center Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: messages.length > 0 ? 'flex-start' : 'center',
            alignItems: messages.length > 0 ? 'stretch' : 'center',
            p: 4,
            overflowY: 'auto'
          }}
        >
          {messages.length === 0 ? (
            // Empty State
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1,
                  mb: 3
                }}
              >
                <Box sx={{ width: 40, height: 40, bgcolor: '#ff9800', borderRadius: 1 }} />
                <Box sx={{ width: 40, height: 40, bgcolor: '#ff9800', borderRadius: 1 }} />
                <Box sx={{ width: 40, height: 40, bgcolor: '#1e4d7b', borderRadius: 1 }} />
                <Box sx={{ width: 40, height: 40, bgcolor: '#ff9800', borderRadius: 1 }} />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 600, color: '#ff9800', mb: 1 }}>
                Build Your Quote
              </Typography>

              <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                Use any of the following ways to build out your quick quote.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#e0e0e0',
                    color: '#666',
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#00446A',
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  Chat To Quote
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{
                    textTransform: 'none',
                    borderColor: '#e0e0e0',
                    color: '#666',
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#00446A',
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  Upload An Attachment
                </Button>
              </Stack>
            </>
          ) : (
            // Conversation View
            <Box sx={{ maxWidth: 1000, mx: 'auto', width: '100%' }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: message.isArchive ? '85%' : (message.isHeadsUp || message.isSuccess ? '100%' : '70%'),
                      bgcolor: message.isSuccess ? '#e8f5e9' : (message.isHeadsUp ? '#fff3cd' : (message.isArchive ? '#f5f5f5' : (message.type === 'user' ? '#c5d9f1' : 'white'))),
                      p: message.isArchive ? 1.5 : 2,
                      borderRadius: 2,
                      border: message.isSuccess ? '1px solid #4caf50' : (message.isHeadsUp ? '1px solid #ffc107' : (message.type === 'system' ? '1px solid #e0e0e0' : 'none')),
                      borderLeft: message.isArchive ? '3px solid #00446A' : 'none'
                    }}
                  >
                    {message.isSuccess && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: '#4caf50', mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="overline" sx={{ fontWeight: 600, color: '#4caf50', display: 'block', mb: 0.5 }}>
                            SUCCESS
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#333', fontWeight: 600, mb: 1 }}>
                            {message.text}
                          </Typography>
                          {message.changes && message.changes.length > 0 && (
                            <Box sx={{ mb: message.showFinalizeButton ? 2 : 0 }}>
                              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                Updated fields:
                              </Typography>
                              <Box component="ul" sx={{ m: 0, pl: 3 }}>
                                {message.changes.map((change, idx) => (
                                  <Typography component="li" key={idx} variant="body2" sx={{ color: '#333', mb: 0.5 }}>
                                    {change}
                                  </Typography>
                                ))}
                              </Box>
                            </Box>
                          )}
                          {message.showFinalizeButton && (
                            <Button
                              variant="contained"
                              onClick={handleFinalizeQuote}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#ffc107',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                      '0%, 100%': { opacity: 1 },
                                      '50%': { opacity: 0.5 }
                                    }
                                  }}
                                />
                              }
                              sx={{
                                bgcolor: '#4caf50',
                                textTransform: 'none',
                                borderRadius: '4px',
                                padding: '10px 20px',
                                '&:hover': {
                                  bgcolor: '#388e3c'
                                }
                              }}
                            >
                              Finalize Quote, All Details Correct
                            </Button>
                          )}
                        </Box>
                      </Box>
                    )}
                    {message.isHeadsUp && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <WarningIcon sx={{ color: '#ff9800', mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="overline" sx={{ fontWeight: 600, color: '#ff9800', display: 'block', mb: 0.5 }}>
                            HEADS UP
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#333', mb: message.showFinalizeButton ? 2 : 0 }}>
                            {message.text}
                          </Typography>
                          {message.showFinalizeButton && (
                            <Button
                              variant="contained"
                              onClick={handleFinalizeQuote}
                              startIcon={
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: '#ffc107',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                      '0%, 100%': { opacity: 1 },
                                      '50%': { opacity: 0.5 }
                                    }
                                  }}
                                />
                              }
                              sx={{
                                bgcolor: '#ef6c00',
                                textTransform: 'none',
                                borderRadius: '4px',
                                padding: '10px 20px',
                                '&:hover': {
                                  bgcolor: '#e65100'
                                }
                              }}
                            >
                              Finalize Quote, All Details Correct
                            </Button>
                          )}
                        </Box>
                      </Box>
                    )}
                    {!message.isHeadsUp && !message.isSuccess && (
                      <>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 0.5,
                            fontStyle: message.isArchive ? 'italic' : 'normal',
                            color: message.isArchive ? '#666' : 'inherit',
                            fontSize: message.isArchive ? '0.9rem' : '1rem'
                          }}
                        >
                          {message.text}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {message.timestamp}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              ))}

              {/* Thinking Indicator */}
              {isThinking && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'white',
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#666',
                          animation: 'pulse 1.4s infinite ease-in-out',
                          animationDelay: '0s',
                          '@keyframes pulse': {
                            '0%, 80%, 100%': {
                              opacity: 0.3
                            },
                            '40%': {
                              opacity: 1
                            }
                          }
                        }}
                      />
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#666',
                          animation: 'pulse 1.4s infinite ease-in-out',
                          animationDelay: '0.2s',
                          '@keyframes pulse': {
                            '0%, 80%, 100%': {
                              opacity: 0.3
                            },
                            '40%': {
                              opacity: 1
                            }
                          }
                        }}
                      />
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#666',
                          animation: 'pulse 1.4s infinite ease-in-out',
                          animationDelay: '0.4s',
                          '@keyframes pulse': {
                            '0%, 80%, 100%': {
                              opacity: 0.3
                            },
                            '40%': {
                              opacity: 1
                            }
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Thinking This May Take A Minute...
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Blocker Card */}
              {currentStep === 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    padding: '14px 16px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                    borderRadius: '4px',
                    border: '1px solid #f5c6cb',
                    background: '#f8d7da',
                    mb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon sx={{ color: '#d32f2f' }} />
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '166%',
                        letterSpacing: '0.4px',
                        color: '#721c24'
                      }}
                    >
                      BLOCKER
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#721c24' }}>
                    Weight data is missing or unreadable
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#721c24' }}>
                    Rows 122 and 129 have no weight value — we can't estimate pallets or calculate a rate without it. These shipments will be excluded from the quote until resolved.
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={handleDecisionButton1}
                      startIcon={
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#ffc107',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.5 }
                            }
                          }}
                        />
                      }
                      sx={{
                        bgcolor: '#00446A',
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        '&:hover': {
                          bgcolor: '#003350'
                        }
                      }}
                    >
                      1. I Will Provide Updated Excel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDecisionButton2}
                      sx={{
                        bgcolor: '#00446A',
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        '&:hover': {
                          bgcolor: '#003350'
                        }
                      }}
                    >
                      2. Exclude This Data And Continue
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Decision Card 2 */}
              {currentStep === 3 && (
                <Box
                  sx={{
                    display: 'flex',
                    padding: '14px 16px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '10px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    background: '#E1F5FE',
                    mb: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon sx={{ color: '#1976d2' }} />
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '166%',
                        letterSpacing: '0.4px'
                      }}
                    >
                      DECISION NEEDED (2/2)
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Row 125: Weight unit is blank — LBS or CWT?
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#333' }}>
                    Row 125 has a weight of 1.14 with no unit specified. If this is CWT, the actual weight is 114 lbs. If it's already in LBS, the pallet count would be less than 0.1 — likely a data entry error. We need to know which before proceeding.
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={handleDecision2Button1}
                      startIcon={
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#ffc107',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.5 }
                            }
                          }}
                        />
                      }
                      sx={{
                        bgcolor: '#00446A',
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        '&:hover': {
                          bgcolor: '#003350'
                        }
                      }}
                    >
                      1. Treat As CWT (114 LBS)
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDecision2Button2}
                      sx={{
                        bgcolor: '#00446A',
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        '&:hover': {
                          bgcolor: '#003350'
                        }
                      }}
                    >
                      2. Keep As Is (1.14 LBS)
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Parameters Confirmation Card */}
              {currentStep === 7 && (
                <Box
                  sx={{
                    bgcolor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 3,
                    mb: 2
                  }}
                >
                    {/* Project Info - Compact Table */}
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 2,
                      mb: 3,
                      pb: 3,
                      borderBottom: '1px solid #e0e0e0'
                    }}>
                      <Typography variant="body2" sx={{ color: '#666' }}>Client:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Justin</Typography>

                      <Typography variant="body2" sx={{ color: '#666' }}>Project:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>IL Consolidation Program</Typography>

                      <Typography variant="body2" sx={{ color: '#666' }}>Analysis Period:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Oct 2024 - Sep 2025 (12-month lookback)</Typography>

                      <Typography variant="body2" sx={{ color: '#666' }}>Quote Date:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>April 28, 2026</Typography>
                    </Box>

                    {/* Pricing Factors - Badge Style */}
                    <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid #e0e0e0' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#00446A' }}>
                        Pricing Factors
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                        <Box sx={{
                          bgcolor: '#e3f2fd',
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          border: '1px solid #90caf9'
                        }}>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', fontSize: '11px' }}>
                            Volume
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            High
                          </Typography>
                        </Box>
                        <Box sx={{
                          bgcolor: '#fff3e0',
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          border: '1px solid #ffb74d'
                        }}>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', fontSize: '11px' }}>
                            Pallet Density
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#f57c00' }}>
                            Medium
                          </Typography>
                        </Box>
                        <Box sx={{
                          bgcolor: '#ffebee',
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          border: '1px solid #ef5350'
                        }}>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', fontSize: '11px' }}>
                            Competition
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                            High
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Customer Analysis - Highlighted Box */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#00446A' }}>
                        Customer Analysis
                      </Typography>
                      <Box sx={{
                        bgcolor: '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        borderLeft: '4px solid #00446A'
                      }}>
                        <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.7 }}>
                          Justin's shipment mix is heavily weighted toward CVS (68% of volume), with consistent pallet counts across lanes. The geographic spread is national but concentrated in the Midwest and East Coast. Recommended approach: tiered pricing by retailer channel with volume incentives for CVS expansion.
                        </Typography>
                      </Box>
                    </Box>

                  {/* Model Factors Confirmation */}
                  <Box sx={{
                    mt: 3,
                    p: 2.5,
                    bgcolor: '#fffbf0',
                    border: '1px solid #ffc107',
                    borderRadius: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <InfoIcon sx={{ color: '#f57c00', mt: 0.5, fontSize: 20 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                          Do you agree with these pricing factors?
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block', lineHeight: 1.6 }}>
                          The factors shown above (Volume, Pallet Density, Competition) will determine the pricing in your quote.
                          If you disagree or need adjustments, changes will impact the final prices generated.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Generate Quote Button */}
                  <Box sx={{ pt: 3, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleGenerateQuote}
                      startIcon={
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#ffc107',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.5 }
                            }
                          }}
                        />
                      }
                      sx={{
                        bgcolor: '#00446A',
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '12px 20px',
                        fontSize: '16px',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#003350'
                        }
                      }}
                    >
                      Generate Quote
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #e0e0e0',
            bgcolor: 'white'
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', maxWidth: 1200, mx: 'auto' }}>
            <IconButton
              onClick={handleClick}
              sx={{
                bgcolor: open ? '#f5f5f5' : 'transparent',
                position: 'relative',
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              <AddIcon />
              {((currentStep === 0 && selectedClient) || currentStep === 2 || currentStep === 8) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#ffc107',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': {
                        opacity: 1
                      },
                      '50%': {
                        opacity: 0.5
                      }
                    }
                  }}
                />
              )}
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleAttachFile}>
                <AttachFileIcon sx={{ mr: 1, fontSize: 20 }} />
                Attach file
              </MenuItem>
            </Menu>

            <TextField
              fullWidth
              placeholder="Begin describing your quote here."
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'white'
                }
              }}
            />

            <IconButton
              sx={{
                bgcolor: '#e0e0e0',
                '&:hover': {
                  bgcolor: '#d0d0d0'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#999' }}>
            InsightAI can make mistakes. Consider checking important information.
          </Typography>
        </Box>
        </>
        )}
      </Box>
      </Box>
    </Box>
  )
}

export default App
