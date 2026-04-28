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
  Chip
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
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

const drawerWidth = 280

function App() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [expandedClients, setExpandedClients] = useState({})
  const [selectedClient, setSelectedClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [quoteStatus, setQuoteStatus] = useState('Draft')
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
        text: 'User attached "Copy of Justin\'s Proposal IL 2.5.26 (1).xlsx"',
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
        text: 'User attached "Copy of Justin\'s Proposal IL 2.5.26 (2).xlsx"',
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

          // After thinking, show third decision card
          setTimeout(() => {
            setIsThinking(false)
            setCurrentStep(5) // Show decision card 3
          }, 2000)
        }, 800)
      }, 500)
    }, 300)
  }

  const handleDecision3Button = () => {
    // User chooses "Apply nearest state rate"
    setCurrentStep(6) // Hide Decision Card 3 immediately
    setMessages(prev => [...prev, {
      type: 'system',
      text: 'User was informed that some retailers were not in the contracted rate table and had the option to apply proxy rates.',
      timestamp: '03:08 PM',
      isArchive: true
    }])

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'Apply nearest state rate',
        timestamp: '03:08 PM'
      }])

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Got it. I\'ve applied proxy rates for the 2 uncontracted retailers: Walmart DC #6009 → Tennessee state rate ($180/pallet), Costco Wholesale → California state rate ($300/pallet). These will be flagged in the quote output so RJW can follow up on contracted rates if volume justifies it.',
          timestamp: '03:08 PM'
        }])

        // Show thinking indicator
        setTimeout(() => {
          setIsThinking(true)

          // After thinking, show final preview
          setTimeout(() => {
            setIsThinking(false)
            setMessages(prev => [...prev, {
              type: 'system',
              text: 'Your file processed successfully — 117 shipments across 4 retailers. Before I build the quote, I need you to confirm a few things I\'ve pulled from the data.',
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
        text: 'Quote Preview Is Generating — Review the HTML in the new tab. If you need to make changes, edit the HTML and reupload it here. Otherwise, click "Finalize Quote" below if all details are correct.',
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
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#fafafa' }}>
      {/* Sidebar */}
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
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
              RJW Quick Quote
            </Typography>
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
              {/* Workflow Progress Indicator */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #e0e0e0'
              }}>
                {[
                  { step: 0, label: 'Upload' },
                  { step: 1, label: 'Validation 1/3' },
                  { step: 3, label: 'Validation 2/3' },
                  { step: 5, label: 'Validation 3/3' },
                  { step: 7, label: 'Review' },
                  { step: 8, label: 'Generate' },
                  { step: 9, label: 'Finalize' }
                ].map((item, index, array) => (
                  <Box key={item.step} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: currentStep >= item.step ? '#ffc107' : '#e0e0e0',
                          transition: 'background-color 0.3s'
                        }}
                      />
                      <Typography variant="caption" sx={{ fontSize: '10px', color: currentStep >= item.step ? '#ffc107' : '#999' }}>
                        {item.label}
                      </Typography>
                    </Box>
                    {index < array.length - 1 && (
                      <Box
                        sx={{
                          width: 40,
                          height: 2,
                          bgcolor: currentStep > item.step ? '#ffc107' : '#e0e0e0',
                          transition: 'background-color 0.3s',
                          mb: 2
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
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
                      maxWidth: message.isArchive ? '85%' : (message.isHeadsUp ? '100%' : '70%'),
                      bgcolor: message.isHeadsUp ? '#fff3cd' : (message.isArchive ? '#f5f5f5' : (message.type === 'user' ? '#c5d9f1' : 'white')),
                      p: message.isArchive ? 1.5 : 2,
                      borderRadius: 2,
                      border: message.isHeadsUp ? '1px solid #ffc107' : (message.type === 'system' ? '1px solid #e0e0e0' : 'none'),
                      borderLeft: message.isArchive ? '3px solid #00446A' : 'none'
                    }}
                  >
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
                    {!message.isHeadsUp && (
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
                      sx={{
                        bgcolor: '#d32f2f',
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        '&:hover': {
                          bgcolor: '#b71c1c'
                        }
                      }}
                    >
                      1. I Will Provide Updated Excel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDecisionButton2}
                      sx={{
                        bgcolor: '#d32f2f',
                        textTransform: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        '&:hover': {
                          bgcolor: '#b71c1c'
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
                      DECISION NEEDED (2/3)
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
                  {/* CLIENT DETAILS */}
                  <Typography variant="overline" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 2 }}>
                    CLIENT DETAILS
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, mb: 4 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Client</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>RJW Logistics Group</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Opportunity / project</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>IL Consolidation Program</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Quote date</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>April 28, 2026</Typography>
                    </Box>
                  </Box>

                  {/* SCOPE ASSUMPTIONS */}
                  <Typography variant="overline" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 2 }}>
                    SCOPE ASSUMPTIONS
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Service type</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>Internal consolidation</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Temperature</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>Dry only</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Retailers in scope</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>CVS, Kehe, SuperValu, All Others</Typography>
                  </Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Geography</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>National (US)</Typography>
                  </Box>

                  {/* MARKET RATE INPUTS */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="overline" sx={{ fontWeight: 600, color: '#666' }}>
                      MARKET RATE INPUTS
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#1976d2' }}>
                      Pulled from proposal tab
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3, mb: 4 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Pallet weight assumption</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>1,620 lbs / pallet</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>In/out handling (dry)</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>$9.50 / inbound pallet</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Initial storage</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>$9.00 / pallet (up to 57")</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Case picking</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>$0.37 / case</Typography>
                  </Box>

                  {/* DATE RANGE */}
                  <Typography variant="overline" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 2 }}>
                    DATE RANGE
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Invoice history period</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>Oct 2024 - Sep 2025</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>Annualization</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>12-month lookback (full)</Typography>
                    </Box>
                  </Box>

                  {/* SPECIAL REQUIREMENTS */}
                  <Typography variant="overline" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 2 }}>
                    SPECIAL REQUIREMENTS
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#666', mb: 3 }}>
                    Nothing captured yet — add anything that should factor into pricing (e.g. appointment requirements, driver assist, extended storage exposure).
                  </Typography>

                  {/* Generate Quote Button */}
                  <Box sx={{ pt: 2, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleGenerateQuote}
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

              {/* Decision Card 3 */}
              {currentStep === 5 && (
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
                      DECISION NEEDED (3/3)
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Retailer not in your contracted rate table
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#333' }}>
                    We found shipments to Walmart DC #6009 (Shelbyville, TN) and Costco Wholesale (Tracy, CA). Neither appears in RJW's current rate table. These could be one-off spot shipments, or retailers you're actively quoting that should be added.
                  </Typography>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={handleDecision3Button}
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
                      Apply Nearest State Rate
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setCurrentStep(6)}
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
                      Update Excel
                    </Button>
                  </Stack>
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
              {currentStep === 0 && selectedClient && (
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
      </Box>
    </Box>
  )
}

export default App
