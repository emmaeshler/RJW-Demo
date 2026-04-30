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
  ListItemIcon,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel
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
  AccountCircle as AccountCircleIcon,
  Lightbulb as LightbulbIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material'

const drawerWidth = 280
const navDrawerWidth = 240

function App() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [expandedClients, setExpandedClients] = useState({})
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [selectedAIClient, setSelectedAIClient] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [quoteStatus, setQuoteStatus] = useState('Draft')
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const [currentApp, setCurrentApp] = useState('quick-quote')
  const [insightView, setInsightView] = useState('scorecard') // 'scorecard' or 'customer-detail'
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [recommendationExpanded, setRecommendationExpanded] = useState(false)
  const [clientFilter, setClientFilter] = useState('all') // 'all', 'needs-attention', 'watch', 'healthy'
  const [badgeFilter, setBadgeFilter] = useState(null) // null or badge type ('W', 'M', 'L', '!', '✓')
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc') // 'asc' or 'desc'
  const [ratesAccordionOpen, setRatesAccordionOpen] = useState(false)
  const [adjustRatesModalOpen, setAdjustRatesModalOpen] = useState(false)
  const [ratesChanged, setRatesChanged] = useState(false)
  const [quoteGenerated, setQuoteGenerated] = useState(false)
  const [quoteDetailLevel, setQuoteDetailLevel] = useState('standard')
  const [chatInput, setChatInput] = useState('')
  const [entryPoint, setEntryPoint] = useState(null) // 'traditional' or 'chat'
  const [isChatFocused, setIsChatFocused] = useState(false)
  const [editableRates, setEditableRates] = useState({
    warehouseRates: [
      { location: 'Chicago, IL - Primary', rate: 3.25 },
      { location: 'Dallas, TX - Secondary', rate: 2.95 }
    ],
    channelRates: [
      { channel: 'CVS', ratePerPallet: 42.00 },
      { channel: 'Walgreens', ratePerPallet: 45.50 },
      { channel: 'Target', ratePerPallet: 43.75 },
      { channel: 'Kroger', ratePerPallet: 41.25 }
    ]
  })
  const [originalRates, setOriginalRates] = useState({
    warehouseRates: [
      { location: 'Chicago, IL - Primary', rate: 3.25 },
      { location: 'Dallas, TX - Secondary', rate: 2.95 }
    ],
    channelRates: [
      { channel: 'CVS', ratePerPallet: 42.00 },
      { channel: 'Walgreens', ratePerPallet: 45.50 },
      { channel: 'Target', ratePerPallet: 43.75 },
      { channel: 'Kroger', ratePerPallet: 41.25 }
    ]
  })
  const open = Boolean(anchorEl)

  // Customer detail data for drill-in
  const customerDetails = {
    'Our Home': {
      name: 'Our Home',
      type: 'summary', // Flag to indicate this uses summary KPIs
      marginPerPallet: '$409',
      marginPercent: '39.2%',
      numPallets: '20,300',
      potentialMonthlyImpact: '+$127,000',
      currentPalletRate: '$68.75',
      palletLanes: [
        { from: 'Los Angeles, CA', to: 'Target - Northeast DC', pallets: 3450, currentRate: '$72.50', suggested: '$75.00', additionalRevenue: '+$8,625' },
        { from: 'Los Angeles, CA', to: 'Walmart - Southeast DC', pallets: 2890, currentRate: '$68.00', suggested: '$70.50', additionalRevenue: '+$7,225' },
        { from: 'Los Angeles, CA', to: 'Home Depot - Midwest DC', pallets: 2150, currentRate: '$65.25', suggested: '$67.75', additionalRevenue: '+$5,375' },
        { from: 'Phoenix, AZ', to: 'Lowe\'s - Texas DC', pallets: 3280, currentRate: '$58.50', suggested: '$61.00', additionalRevenue: '+$8,200' },
        { from: 'Phoenix, AZ', to: 'Bed Bath & Beyond - Mountain DC', pallets: 1820, currentRate: '$62.75', suggested: '$65.25', additionalRevenue: '+$4,550' },
        { from: 'Seattle, WA', to: 'Costco - Northwest DC', pallets: 2980, currentRate: '$71.25', suggested: '$74.00', additionalRevenue: '+$8,195' },
        { from: 'Seattle, WA', to: 'Amazon - California FC', pallets: 2450, currentRate: '$69.50', suggested: '$72.00', additionalRevenue: '+$6,125' },
        { from: 'Dallas, TX', to: 'Wayfair - East Coast DC', pallets: 1280, currentRate: '$75.00', suggested: '$78.50', additionalRevenue: '+$4,480' }
      ],
      warehouseRates: [
        { location: 'Los Angeles, CA - Primary', currentRate: '$4.15/pallet/day', suggested: '$4.45/pallet/day', monthlyCost: '$32,850', suggestedCost: '$35,225', additionalRevenue: '+$2,375' },
        { location: 'Phoenix, AZ - Regional', currentRate: '$3.85/pallet/day', suggested: '$4.10/pallet/day', monthlyCost: '$24,780', suggestedCost: '$26,390', additionalRevenue: '+$1,610' },
        { location: 'Seattle, WA - Pacific Northwest Hub', currentRate: '$4.25/pallet/day', suggested: '$4.55/pallet/day', monthlyCost: '$28,950', suggestedCost: '$30,985', additionalRevenue: '+$2,035' },
        { location: 'Dallas, TX - Secondary', currentRate: '$3.75/pallet/day', suggested: '$4.00/pallet/day', monthlyCost: '$18,750', suggestedCost: '$20,000', additionalRevenue: '+$1,250' }
      ],
      suggestion: 'Our Home is a strong strategic account with high volume and healthy margins. The account is currently delivering $409 margin per pallet across 20,300 annual pallets. We recommend targeted rate increases across 8 key lanes to better align pricing with current market conditions and service value. These lane updates could generate approximately +$52,775 in additional monthly transportation revenue. Recommended warehouse rate adjustments could add another +$7,270 per month. Total estimated opportunity: +$60,045 per month (+$720K annually). This approach helps improve pricing while maintaining competitive service levels and supporting a strong long-term partnership.',
      potentialImpact: '+$60,045/month rate optimization opportunity'
    },
    'Justin': {
      name: 'Justin',
      currentPalletRate: '$42.50',
      palletLanes: [
        { from: 'Chicago, IL', to: 'CVS - Northeast DC', pallets: 245, currentRate: '$38.25', suggested: '$42.00', savings: '-$918.75' },
        { from: 'Chicago, IL', to: 'Walgreens - Memphis', pallets: 132, currentRate: '$45.50', suggested: '$48.00', savings: '-$330.00' },
        { from: 'Chicago, IL', to: 'Target - Atlanta', pallets: 89, currentRate: '$42.75', suggested: '$45.50', savings: '-$244.75' },
        { from: 'Dallas, TX', to: 'CVS - Southwest DC', pallets: 156, currentRate: '$39.00', suggested: '$41.75', savings: '-$429.00' }
      ],
      warehouseRates: [
        { location: 'Chicago, IL - Primary', currentRate: '$3.25/pallet/day', suggested: '$3.50/pallet/day', monthlyCost: '$4,875', suggestedCost: '$5,250' },
        { location: 'Dallas, TX - Secondary', currentRate: '$2.95/pallet/day', suggested: '$3.15/pallet/day', monthlyCost: '$2,360', suggestedCost: '$2,520' }
      ],
      suggestion: 'Based on current market rates and lane analysis, we recommend adjusting pallet rates across all major lanes. The current pricing is $42/shipment below LTL benchmark, representing significant revenue opportunity. Warehouse rates are competitive but slight adjustments align with regional market increases.',
      potentialImpact: '+$1,922.50/month in transportation revenue, +$535/month in warehouse revenue'
    }
  }

  const aiRecommendations = {
    'Our Home': {
      title: 'Strategic Priority: Revenue Optimization on High-Volume Account',
      recommendation: `AI analysis identifies Our Home as your premier strategic account - $21.2M in revenue with exceptional operational metrics (39.2% margin, 33.3% logistics margin). With 20,300 annual pallets and strong retailer diversification (Walmart at 11% - well below risk threshold), this relationship is positioned for sustainable revenue growth. The AI recommends a consultative pricing review across 8 high-volume lanes where current rates lag market benchmarks by 3-4%. These targeted adjustments could generate +$52,775 in monthly transportation revenue without disrupting service quality. Complementary warehouse rate optimization adds another +$7,270/month. Total opportunity: +$60K monthly (+$720K annually). The strategic approach: frame this as a partnership investment in continued service excellence and market-rate alignment, not as price increases. Given the account's scale and health, this positions you as a value-driven partner focused on long-term collaboration.`,
      potential: '$720K annual revenue optimization',
      actions: ['Week 1-2: Prepare executive rate review with detailed market benchmarking', 'Week 3-4: Present strategic pricing proposal to Our Home leadership', 'Week 5-8: Phase implementation across 8 priority lanes', 'Month 3+: Monitor service levels and relationship health during transition']
    },
    'Justin': {
      title: 'Strategic Priority: Margin Optimization',
      recommendation: `AI analysis identifies focused margin improvement as the primary opportunity. Your highest-revenue client ($4.8M) has excellent retailer diversification (Walmart at 8% - well below the 23% concentration risk threshold), which positions you to capture margin gains without single-customer dependency. Phase 1 (immediate): Fix the margin rate issue. At 12.2% vs 15.5% benchmark, this represents $18.7K in annual opportunity and is a straightforward correction. Phase 2 (30-60 days): Correct LTL pricing to prevent future margin erosion as volume scales. Phase 3 (ongoing): Protect current retailer balance - the 8% Walmart mix is strategically sound and reduces business risk. The sequencing matters because margin improvements compound across all channels, and your current diversified base insulates you from retailer-specific volatility.`,
      potential: '$45K annual margin gain',
      actions: ['Week 1: Initiate margin rate review with finance', 'Week 2-4: Present revised rate structure to client', 'Week 4-8: Implement LTL benchmark pricing', 'Ongoing: Maintain healthy retailer diversification below 23%']
    },
    'Trove Brands LLC': {
      title: 'Margin Priority with Diversification Watch',
      recommendation: `Pattern recognition shows Trove Brands LLC is a strong candidate for tiered volume pricing. Current margin of 11.2% vs 15.5% benchmark represents $53K in annual opportunity on your $1.2M base. AI recommendation: introduce a 3-tier volume incentive structure. Their 18% Walmart penetration is approaching the concentration threshold - any pricing incentives should encourage diversification across Target, Kroger, and regional channels rather than deepening Walmart dependency. A multi-retailer tiered approach protects margin while reducing single-customer risk. Benchmark data shows clients with balanced retailer mix (no single channel above 20%) have 40% lower churn and more stable revenue.`,
      potential: '$53K annual margin improvement',
      actions: ['Week 1-2: Design 3-tier volume pricing model (13%/14.5%/16% target margins)', 'Week 3: Present tiered structure with multi-retailer incentives', 'Month 2: Track margin improvement and retailer balance', 'Quarter 2: Monitor Walmart % stays below 23% threshold']
    },
    'AB WORLD FOODS': {
      title: 'Critical: Margin + Diversification Risk',
      recommendation: `This is your #1 intervention priority. AB WORLD FOODS combines margin underperformance with extremely low retailer diversification (Walmart at only 6%). While low Walmart % is normally positive, this client is too concentrated elsewhere - creating different single-retailer dependency. The strategic conversation is about building a balanced multi-retailer model. Executive business review agenda: (1) Immediate LTL rate correction ($28K quick win), (2) 60-day margin improvement plan targeting 14%, (3) 90-day retailer balance strategy - analyze which non-Walmart channel is over-concentrated and develop diversification roadmap across Walmart, Target, and specialty. The goal is no single retailer above 30% to reduce churn risk.`,
      potential: '$163K margin opportunity + reduced concentration risk',
      actions: ['Week 1: Schedule executive business review (VP+ level)', 'Week 2: Present 90-day partnership roadmap during EBR', 'Week 2-3: Implement LTL rate correction', 'Month 2-3: Execute margin improvement plan', 'Month 3-6: Develop balanced multi-retailer strategy']
    },
    'Simple Mills': {
      title: 'Protect Margin, Monitor Mix',
      recommendation: `Your healthiest client relationship - 19.3% margin on $3.9M revenue. The strategic priority here is preservation, not expansion. Current Walmart penetration at 14% is ideal from a diversification standpoint. AI recommendation: resist any Walmart-exclusive programs that would push penetration above 23%. Instead, focus on maintaining this profitable, balanced relationship. If Simple Mills requests Walmart growth, counter-propose a multi-retailer expansion (Target, Whole Foods, Sprouts) that grows total volume while keeping Walmart percentage stable. This protects your margin and reduces concentration risk. The healthiest long-term partnerships have strong margins AND retailer diversity.`,
      potential: 'Protect $764K annual margin (19.3% on $3.9M)',
      actions: ['Month 1: Communicate strategic value of current retailer balance to Simple Mills', 'Ongoing: Monitor Walmart % stays below 20%', 'If growth requested: Propose multi-retailer expansion plan', 'Quarterly: Review margin and diversification metrics']
    },
    'Partake Foods': {
      title: 'Fix Foundation, Preserve Balance',
      recommendation: `AI risk assessment flags operational and pricing issues that must be fixed before any channel expansion. Partake Foods has healthy retailer diversification (Walmart at 10% - well below 23% threshold), which is a strategic asset to protect. Priority sequence: Step 1 (immediate): Correct LTL pricing ($18 below benchmark). As they scale in the allergen-free category, this gap becomes exponentially more expensive. Step 2 (30-60 days): Improve operational margin from 13.5% to 15.5% through warehouse efficiency. Step 3 (ongoing): Maintain current retailer balance. Do NOT pursue aggressive Walmart expansion - their 10% mix is strategically sound. Growing any single retailer above 23% increases business risk and negotiation leverage imbalance. The sequencing is critical: fix operational foundation first, then protect the diversified retailer base that insulates you from concentration risk.`,
      potential: '$40K+ margin protection through operational fixes',
      actions: ['Week 1-2: Implement LTL pricing correction', 'Week 3-8: Operational efficiency audit (warehouse, routing)', 'Week 8-10: Implement improvements targeting 15.5% margin', 'Ongoing: Maintain Walmart below 15% to preserve retailer balance']
    }
  }

  // Customers data array for table rendering
  const customersData = [
    { name: 'Our Home', revenue: '$21.2M', marginPerPallet: '$409', logisticsMarginPercent: '33.3', marginPercent: '39.2', walmartPercent: '11', ltlVariance: '+$18', strategicInsights: [], hasAIRecommendation: true },
    { name: 'Trove Brands', revenue: '$3.9M', marginPerPallet: '$159', logisticsMarginPercent: '32.4', marginPercent: '41.0', walmartPercent: '15', ltlVariance: '+$12', strategicInsights: ['M'], hasAIRecommendation: false },
    { name: 'Whirlybird Granola', revenue: '$2.7M', marginPerPallet: '$279', logisticsMarginPercent: '38.0', marginPercent: '39.8', walmartPercent: '7', ltlVariance: '+$25', strategicInsights: ['M'], hasAIRecommendation: false },
    { name: 'Lipton', revenue: '$1.1M', marginPerPallet: '$235', logisticsMarginPercent: '28.6', marginPercent: '35.8', walmartPercent: '19', ltlVariance: '-$8', strategicInsights: ['L'], hasAIRecommendation: false },
    { name: 'Milky Way', revenue: '$900K', marginPerPallet: '$454', logisticsMarginPercent: '47.0', marginPercent: '42.9', walmartPercent: '8', ltlVariance: '+$22', strategicInsights: ['!'], hasAIRecommendation: false },
    { name: 'Justin', revenue: '$585,768', marginPerPallet: '$402', logisticsMarginPercent: '35.1', marginPercent: '12.3', walmartPercent: '8', ltlVariance: '-$42', strategicInsights: ['M', 'L'], hasAIRecommendation: true },
    { name: 'Bragg Live Food', revenue: '$892,450', marginPerPallet: '$230', logisticsMarginPercent: '31.1', marginPercent: '16.8', walmartPercent: '12', ltlVariance: '+$15', strategicInsights: [], hasAIRecommendation: false },
    { name: 'Trove Brands LLC', revenue: '$1,245,880', marginPerPallet: '$290', logisticsMarginPercent: '38.4', marginPercent: '11.2', walmartPercent: '18', ltlVariance: '+$8', strategicInsights: ['M'], hasAIRecommendation: true },
    { name: 'WHIRLYBIRD GRANOLA', revenue: '$324,560', marginPerPallet: '$390', logisticsMarginPercent: '30.6', marginPercent: '17.5', walmartPercent: '5', ltlVariance: '+$22', strategicInsights: [], hasAIRecommendation: false },
    { name: 'AB WORLD FOODS', revenue: '$1,567,230', marginPerPallet: '$345', logisticsMarginPercent: '29.0', marginPercent: '10.8', walmartPercent: '6', ltlVariance: '-$55', strategicInsights: ['M', 'L'], hasAIRecommendation: true },
    { name: "Nature's Path Foods", revenue: '$2,145,900', marginPerPallet: '$211', logisticsMarginPercent: '32.6', marginPercent: '18.2', walmartPercent: '31', ltlVariance: '+$35', strategicInsights: ['W'], hasAIRecommendation: false },
    { name: 'KULI KULI FOODS', revenue: '$456,280', marginPerPallet: '$340', logisticsMarginPercent: '34.0', marginPercent: '13.1', walmartPercent: '9', ltlVariance: '+$12', strategicInsights: ['M'], hasAIRecommendation: false }
  ]

  const handleAIClick = (clientData) => {
    setSelectedAIClient(clientData)
    setAiModalOpen(true)
  }

  const handleAIClose = () => {
    setAiModalOpen(false)
    setSelectedAIClient(null)
  }

  const handleCustomerRightClick = (event, customerName) => {
    event.preventDefault()
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      customerName: customerName
    })
  }

  const handleContextMenuClose = () => {
    setContextMenu(null)
  }

  const handleViewCustomerDetail = () => {
    if (contextMenu && customerDetails[contextMenu.customerName]) {
      setSelectedCustomerDetail(customerDetails[contextMenu.customerName])
      setInsightView('customer-detail')
    }
    handleContextMenuClose()
  }

  const handleBackToScorecard = () => {
    setInsightView('scorecard')
    setSelectedCustomerDetail(null)
  }

  // Helper function to determine client health status
  const getClientHealthStatus = (marginPercent, walmartPercent, ltlVariance) => {
    const margin = parseFloat(marginPercent)
    const walmart = parseFloat(walmartPercent)
    const ltl = parseFloat(ltlVariance?.replace(/[^0-9.-]/g, '') || '0')

    let issueCount = 0

    // Check margin (below 12% is red flag)
    if (margin < 12) issueCount += 2  // Major issue
    else if (margin < 15.5) issueCount += 1  // Minor issue

    // Check Walmart concentration (above 23% is red flag)
    if (walmart > 23) issueCount += 2  // Major issue
    else if (walmart > 20) issueCount += 1  // Minor issue

    // Check LTL variance (negative is issue)
    if (ltl < -40) issueCount += 2  // Major issue
    else if (ltl < 0) issueCount += 1  // Minor issue

    // Determine status
    if (issueCount >= 3) return { status: 'needs-attention', color: '#D13438', label: 'Needs Attention' }
    if (issueCount >= 1) return { status: 'watch', color: '#F2711C', label: 'Watch' }
    return { status: 'healthy', color: '#107C10', label: 'Healthy' }
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New column, default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleBadgeClick = (badge) => {
    // Toggle badge filter - click same badge to clear
    setBadgeFilter(badgeFilter === badge ? null : badge)
  }

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

  const handleChatEntryPoint = () => {
    // Set entry point and client
    setEntryPoint('chat')
    setSelectedClient('Justins')

    // Add user's chat message
    setMessages([{
      type: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }])

    // Clear input
    setChatInput('')

    // Show thinking state after a short delay
    setTimeout(() => {
      setIsThinking(true)
    }, 500)

    // Mock AI pulls CRM data and responds
    setTimeout(() => {
      setIsThinking(false)
      setMessages(prev => [...prev, {
        type: 'system',
        text: 'Perfect! I\'ve pulled the relevant details from your CRM for Justin\'s IL Consolidation Program. I found their account history, current rates, and shipping patterns with 117 shipments across 4 retailers. Let me validate the data before we proceed.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }])

      // After brief pause, show the weight decision question
      setTimeout(() => {
        // Move to step 3 which shows the weight decision card
        setCurrentStep(3)
      }, 2000)
    }, 3000)
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

  const handleDecisionButton3 = () => {
    // User chooses "Use default logic to calculate"
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
        text: 'Use default logic to calculate',
        timestamp: '03:06 PM'
      }])

      // System acknowledgment
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Understood. I\'ll apply default weight calculations for missing data based on historical averages.',
          timestamp: '03:06 PM'
        }])
      }, 500)
    }, 300)
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
    setMessages(prev => [...prev, {
      type: 'system',
      text: 'User was informed that row 125 had a weight unit ambiguity and had several options to choose from.',
      timestamp: '03:07 PM',
      isArchive: true
    }])

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'user',
        text: 'Keep as is (1.14 LBS)',
        timestamp: '03:07 PM'
      }])

      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'system',
          text: 'Perfect. I\'ve noted that.',
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
            setCurrentStep(7) // Show preview card with generate buttons
          }, 2000)
        }, 800)
      }, 500)
    }, 300)
  }

  const handleRateChange = (type, idx, value) => {
    const newRates = { ...editableRates }
    if (type === 'warehouse') {
      newRates.warehouseRates = [...editableRates.warehouseRates]
      newRates.warehouseRates[idx] = { ...newRates.warehouseRates[idx], rate: parseFloat(value) || 0 }
    } else {
      newRates.channelRates = [...editableRates.channelRates]
      newRates.channelRates[idx] = { ...newRates.channelRates[idx], ratePerPallet: parseFloat(value) || 0 }
    }
    setEditableRates(newRates)

    // Check if rates changed by comparing newRates with originalRates
    const warehouseChanged = newRates.warehouseRates.some((rate, i) =>
      rate.rate !== originalRates.warehouseRates[i].rate
    )
    const channelChanged = newRates.channelRates.some((rate, i) =>
      rate.ratePerPallet !== originalRates.channelRates[i].ratePerPallet
    )
    setRatesChanged(warehouseChanged || channelChanged)
  }

  const handleOpenAdjustRates = () => {
    setAdjustRatesModalOpen(true)
  }

  const handleCloseAdjustRates = () => {
    setAdjustRatesModalOpen(false)
  }

  const handleRegenerateQuote = () => {
    // Apply updated rates and regenerate
    setOriginalRates(JSON.parse(JSON.stringify(editableRates)))
    setRatesChanged(false)
    setAdjustRatesModalOpen(false)

    setMessages(prev => [...prev, {
      type: 'user',
      text: 'Regenerate quote with updated rates',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }])

    // Open the HTML quote in a new tab
    window.open('/quote-preview.html', '_blank')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'system',
        text: 'Quote regenerated with your updated rates.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isHeadsUp: true,
        showRatesPreview: true,
        showFinalizeButton: true
      }])
    }, 500)
  }

  const handleFinalizeFromModal = () => {
    setAdjustRatesModalOpen(false)
    handleFinalizeQuote()
  }

  const handleGenerateQuote = () => {
    // User clicks "Generate Quote"
    const quoteType = quoteDetailLevel === 'detailed' ? 'Detailed' : 'Standard'
    setMessages(prev => [...prev, {
      type: 'user',
      text: `Generate ${quoteType.toLowerCase()} quote`,
      timestamp: '03:09 PM'
    }])

    // Mark that quote has been generated
    setQuoteGenerated(true)

    // Update status to Pending Review
    setQuoteStatus('Pending Review')

    // Open both HTML quotes in separate tabs for demo purposes
    window.open('/quote-preview.html', '_blank')
    window.open('/quote-preview-detailed.html', '_blank')

    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'system',
        text: `${quoteType} Quote Preview Is Generating — Review the HTML in the new tab.`,
        timestamp: '03:09 PM',
        isHeadsUp: true,
        showRatesPreview: true,
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
                onClick={() => {
                  setEntryPoint('traditional')
                  setMessages([])
                  setCurrentStep(0)
                  setSelectedClient(null)
                  setChatInput('')
                }}
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
                NEW QUOTE
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
          insightView === 'scorecard' ? (
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
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#323130' }}>
                  Client Scorecard Q4
                </Typography>
                <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '11px' }}>
                  October 1 - December 31, 2025
                </Typography>
              </Box>
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
              {/* Top Metrics Cards - Enhanced PBI Style */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                {/* Margin Improvement Card */}
                <Box sx={{
                  bgcolor: 'white',
                  p: 3,
                  border: '1px solid #E1E1E1',
                  borderLeft: '4px solid #107C10',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="caption" sx={{
                    color: '#8A8886',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 1.5
                  }}>
                    Margin Improvement Opportunity
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#323130', mb: 1, fontSize: '48px', lineHeight: 1 }}>
                    $127K
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5, lineHeight: 1.4 }}>
                    Across 5 of 24 clients priced below market
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ height: 8, bgcolor: '#E1E1E1', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ width: '42%', height: '100%', bgcolor: '#107C10' }}></Box>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '11px', display: 'block', mb: 2 }}>
                    42% of $300K annual target
                  </Typography>

                  {/* Status */}
                  <Typography variant="caption" sx={{ color: '#107C10', fontSize: '12px', fontWeight: 600 }}>
                    ▲ Up $23K vs. Q3 — on track
                  </Typography>
                </Box>

                {/* Walmart Diversification Card */}
                <Box sx={{
                  bgcolor: 'white',
                  p: 3,
                  border: '1px solid #E1E1E1',
                  borderLeft: '4px solid #FFB900',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="caption" sx={{
                    color: '#8A8886',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 1.5
                  }}>
                    Walmart Over-Concentration Risk
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#323130', mb: 1, fontSize: '48px', lineHeight: 1 }}>
                    9
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5, lineHeight: 1.4 }}>
                    of 24 clients above 23% — diversification needed
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ height: 8, bgcolor: '#E1E1E1', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ width: '38%', height: '100%', bgcolor: '#F2711C' }}></Box>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '11px', display: 'block', mb: 2 }}>
                    38% of portfolio at concentration risk
                  </Typography>

                  {/* Status */}
                  <Typography variant="caption" sx={{ color: '#F2711C', fontSize: '12px', fontWeight: 600 }}>
                    Strategic priority: retailer diversification
                  </Typography>
                </Box>

                {/* At-Risk Card */}
                <Box sx={{
                  bgcolor: 'white',
                  p: 3,
                  border: '1px solid #E1E1E1',
                  borderLeft: '4px solid #107C10',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="caption" sx={{
                    color: '#8A8886',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 1.5
                  }}>
                    At-Risk: Below LTL Benchmark
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#323130', mb: 1, fontSize: '48px', lineHeight: 1 }}>
                    3
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5, lineHeight: 1.4 }}>
                    of 24 clients — margin risk on freight
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ height: 8, bgcolor: '#E1E1E1', borderRadius: 1, overflow: 'hidden' }}>
                      <Box sx={{ width: '13%', height: '100%', bgcolor: '#107C10' }}></Box>
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '11px', display: 'block', mb: 2 }}>
                    13% of portfolio — 1 resolved since Q3
                  </Typography>

                  {/* Status */}
                  <Typography variant="caption" sx={{ color: '#107C10', fontSize: '12px', fontWeight: 600 }}>
                    ▼ Down 1 from Q3 — improving
                  </Typography>
                </Box>
              </Box>

              {/* AI Insights Legend - PBI Style */}
              <Box sx={{ mb: 2, p: 2.5, bgcolor: 'white', border: '1px solid #E1E1E1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#323130', display: 'block', mb: 1.5, fontSize: '12px' }}>
                  AI INSIGHTS
                </Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box
                    onClick={() => handleBadgeClick('M')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: badgeFilter === 'M' ? '2px solid #F2711C' : '2px solid transparent',
                      bgcolor: badgeFilter === 'M' ? '#FEF6F0' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: badgeFilter === 'M' ? '#FEF6F0' : '#FAF9F8'
                      }
                    }}
                  >
                    <Box sx={{ width: 16, height: 16, bgcolor: '#F2711C', borderRadius: '2px' }}></Box>
                    <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '12px', fontWeight: badgeFilter === 'M' ? 600 : 400 }}>Margin opportunity</Typography>
                  </Box>
                  <Box
                    onClick={() => handleBadgeClick('W')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: badgeFilter === 'W' ? '2px solid #0078D4' : '2px solid transparent',
                      bgcolor: badgeFilter === 'W' ? '#F0F6FF' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: badgeFilter === 'W' ? '#F0F6FF' : '#FAF9F8'
                      }
                    }}
                  >
                    <Box sx={{ width: 16, height: 16, bgcolor: '#0078D4', borderRadius: '2px' }}></Box>
                    <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '12px', fontWeight: badgeFilter === 'W' ? 600 : 400 }}>Walmart over-concentration</Typography>
                  </Box>
                  <Box
                    onClick={() => handleBadgeClick('L')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: badgeFilter === 'L' ? '2px solid #D13438' : '2px solid transparent',
                      bgcolor: badgeFilter === 'L' ? '#FEF0F0' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: badgeFilter === 'L' ? '#FEF0F0' : '#FAF9F8'
                      }
                    }}
                  >
                    <Box sx={{ width: 16, height: 16, bgcolor: '#D13438', borderRadius: '2px' }}></Box>
                    <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '12px', fontWeight: badgeFilter === 'L' ? 600 : 400 }}>Below LTL rates</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Client Scorecard Table - PBI Style */}
              <Box sx={{ bgcolor: 'white', border: '1px solid #E1E1E1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid #E1E1E1' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#323130', fontSize: '14px', mb: 2 }}>
                    Client performance
                  </Typography>

                  {/* Filter Tabs */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    {[
                      { value: 'all', label: 'All', count: customersData.length },
                      { value: 'needs-attention', label: 'Needs attention', count: customersData.filter(c => getClientHealthStatus(c.marginPercent, c.walmartPercent, c.ltlVariance).status === 'needs-attention').length },
                      { value: 'watch', label: 'Watch', count: customersData.filter(c => getClientHealthStatus(c.marginPercent, c.walmartPercent, c.ltlVariance).status === 'watch').length },
                      { value: 'healthy', label: 'Healthy', count: customersData.filter(c => getClientHealthStatus(c.marginPercent, c.walmartPercent, c.ltlVariance).status === 'healthy').length }
                    ].map(tab => (
                      <Box
                        key={tab.value}
                        onClick={() => setClientFilter(tab.value)}
                        sx={{
                          px: 2,
                          py: 1,
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: clientFilter === tab.value ? 600 : 400,
                          color: clientFilter === tab.value ? '#0078D4' : '#605E5C',
                          bgcolor: clientFilter === tab.value ? '#F3F2F1' : 'transparent',
                          border: clientFilter === tab.value ? '1px solid #0078D4' : '1px solid transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: clientFilter === tab.value ? '#F3F2F1' : '#FAF9F8'
                          }
                        }}
                      >
                        {tab.label} ({tab.count})
                      </Box>
                    ))}
                  </Box>

                  {/* Badge Filter Indicator */}
                  {badgeFilter && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid #E1E1E1' }}>
                      <Typography variant="caption" sx={{ color: '#605E5C', fontSize: '11px', fontWeight: 600 }}>
                        FILTERED BY:
                      </Typography>
                      <Chip
                        label={`Badge: ${badgeFilter}`}
                        onDelete={() => setBadgeFilter(null)}
                        size="small"
                        sx={{
                          height: '24px',
                          fontSize: '12px',
                          bgcolor: '#F3F2F1',
                          '& .MuiChip-deleteIcon': {
                            fontSize: '16px',
                            color: '#605E5C',
                            '&:hover': {
                              color: '#323130'
                            }
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Box sx={{ overflow: 'auto', maxHeight: '600px', width: '100%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E1E1E1', background: '#FAF9F8' }}>
                        <th
                          onClick={() => handleSort('client')}
                          style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '12%', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <Tooltip title="Client name and total revenue" arrow placement="top">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <span>Client</span>
                              {sortColumn === 'client' && (
                                sortDirection === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: '12px' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                              )}
                            </Box>
                          </Tooltip>
                        </th>
                        <th
                          onClick={() => handleSort('marginPerPallet')}
                          style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '12%', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <Tooltip title="Gross margin per pallet - higher is better for profitability" arrow placement="top">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <span>Margin $/Pallet</span>
                              {sortColumn === 'marginPerPallet' && (
                                sortDirection === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: '12px' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                              )}
                            </Box>
                          </Tooltip>
                        </th>
                        <th
                          onClick={() => handleSort('logisticsMargin')}
                          style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '13%', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <Tooltip title="Logistics margin percentage - measures efficiency of transportation operations" arrow placement="top">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <span>Logistics Margin %</span>
                              {sortColumn === 'logisticsMargin' && (
                                sortDirection === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: '12px' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                              )}
                            </Box>
                          </Tooltip>
                        </th>
                        <th
                          onClick={() => handleSort('margin')}
                          style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '12%', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <Tooltip title="Overall margin percentage compared to average of 15.5% - key profitability indicator" arrow placement="top">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <span>Margin %</span>
                              {sortColumn === 'margin' && (
                                sortDirection === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: '12px' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                              )}
                            </Box>
                          </Tooltip>
                        </th>
                        <th
                          onClick={() => handleSort('walmart')}
                          style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '11%', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <Tooltip title="Walmart concentration - target is below 23% for healthy diversification" arrow placement="top">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <span>Walmart %</span>
                              {sortColumn === 'walmart' && (
                                sortDirection === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: '12px' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                              )}
                            </Box>
                          </Tooltip>
                        </th>
                        <th
                          onClick={() => handleSort('ltl')}
                          style={{ padding: '10px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '11%', cursor: 'pointer', userSelect: 'none' }}
                        >
                          <Tooltip
                            title="Shows how far this client is above or below the LTL freight benchmark on a per-pallet basis. Positive values indicate favorable freight performance; negative values indicate the account is below benchmark and may be eroding margin."
                            arrow
                            placement="top"
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                              <span>LTL Variance</span>
                              {sortColumn === 'ltl' && (
                                sortDirection === 'asc' ? <ArrowUpwardIcon sx={{ fontSize: '12px' }} /> : <ArrowDownwardIcon sx={{ fontSize: '12px' }} />
                              )}
                            </Box>
                          </Tooltip>
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '13%' }}>
                          <Tooltip title="Key strategic insights and alerts for this client" arrow placement="top">
                            <span>Strategic Insights</span>
                          </Tooltip>
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px', width: '8%' }}>
                          <Tooltip title="AI-powered pricing model analysis and recommendations" arrow placement="top">
                            <span>Pricing Model Overview</span>
                          </Tooltip>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customersData
                        .sort((a, b) => {
                          if (!sortColumn) return 0

                          let aVal, bVal

                          switch(sortColumn) {
                            case 'client':
                              aVal = a.name.toLowerCase()
                              bVal = b.name.toLowerCase()
                              break
                            case 'marginPerPallet':
                              aVal = parseFloat(a.marginPerPallet.replace(/[^0-9.-]/g, ''))
                              bVal = parseFloat(b.marginPerPallet.replace(/[^0-9.-]/g, ''))
                              break
                            case 'logisticsMargin':
                              aVal = parseFloat(a.logisticsMarginPercent)
                              bVal = parseFloat(b.logisticsMarginPercent)
                              break
                            case 'margin':
                              aVal = parseFloat(a.marginPercent)
                              bVal = parseFloat(b.marginPercent)
                              break
                            case 'walmart':
                              aVal = parseFloat(a.walmartPercent)
                              bVal = parseFloat(b.walmartPercent)
                              break
                            case 'ltl':
                              aVal = parseFloat(a.ltlVariance.replace(/[^0-9.-]/g, ''))
                              bVal = parseFloat(b.ltlVariance.replace(/[^0-9.-]/g, ''))
                              break
                            default:
                              return 0
                          }

                          if (typeof aVal === 'string') {
                            return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
                          } else {
                            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
                          }
                        })
                        .filter(customer => {
                          // Health status filter
                          if (clientFilter !== 'all') {
                            const healthStatus = getClientHealthStatus(customer.marginPercent, customer.walmartPercent, customer.ltlVariance)
                            if (healthStatus.status !== clientFilter) return false
                          }

                          // Badge filter
                          if (badgeFilter !== null) {
                            if (!customer.strategicInsights.includes(badgeFilter)) return false
                          }

                          return true
                        })
                        .map((customer, idx) => {
                        const healthStatus = getClientHealthStatus(customer.marginPercent, customer.walmartPercent, customer.ltlVariance)
                        const marginValue = parseFloat(customer.marginPercent)
                        const marginColor = marginValue >= 15.5 ? '#107C10' : marginValue >= 12 ? '#F2711C' : '#D13438'
                        const marginBarWidth = `${(marginValue / 15.5) * 100}%`

                        const walmartValue = parseFloat(customer.walmartPercent)
                        const walmartColor = walmartValue <= 20 ? '#107C10' : walmartValue <= 23 ? '#F2711C' : '#D13438'
                        const walmartBarWidth = `${(walmartValue / 23) * 100}%`

                        const ltlVariance = customer.ltlVariance
                        const ltlColor = ltlVariance.startsWith('+') ? '#107C10' : ltlVariance.startsWith('-') ? '#D13438' : '#323130'

                        // Helper function to get badge details
                        const getBadgeDetails = (badge) => {
                          switch(badge) {
                            case 'W':
                              return { color: '#0078D4', tooltip: `Walmart concentration risk at ${customer.walmartPercent}% - target below 23% for healthy diversification` }
                            case 'M':
                              return { color: '#F2711C', tooltip: 'Margin opportunity identified - potential improvement available' }
                            case 'L':
                              return { color: '#D13438', tooltip: `LTL freight issue - ${ltlVariance} vs benchmark` }
                            case '!':
                              return { color: '#D13438', tooltip: 'NPO Risk - monitor payment terms and credit exposure' }
                            case '✓':
                              return { color: '#107C10', tooltip: 'On target - all KPIs within healthy range' }
                            default:
                              return { color: '#8A8886', tooltip: 'Strategic insight' }
                          }
                        }

                        return (
                          <tr key={idx} style={{
                            background: idx % 2 === 0 ? 'white' : '#FAF9F8',
                            borderBottom: '1px solid #EDEBE9',
                            borderLeft: `4px solid ${healthStatus.color}`
                          }}>
                            <td
                              style={{
                                padding: '12px 12px',
                                cursor: 'context-menu'
                              }}
                              onContextMenu={(e) => handleCustomerRightClick(e, customer.name)}
                            >
                              <div style={{ color: '#0078D4', fontWeight: 500, textDecoration: 'underline' }}>{customer.name}</div>
                              <div style={{ fontSize: '12px', color: '#605E5C', fontWeight: 400 }}>{customer.revenue}</div>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#323130', fontWeight: 600 }}>{customer.marginPerPallet}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', color: '#323130', fontWeight: 600 }}>{customer.logisticsMarginPercent}%</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                <Box sx={{ flex: 1, maxWidth: 60, height: 4, bgcolor: '#F3F2F1', borderRadius: 1, overflow: 'hidden' }}>
                                  <Box sx={{ width: marginBarWidth, height: '100%', bgcolor: marginColor }}></Box>
                                </Box>
                                <span style={{ color: marginColor, fontWeight: 600, minWidth: 45 }}>{customer.marginPercent}%</span>
                              </Box>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                <Box sx={{ flex: 1, maxWidth: 60, height: 4, bgcolor: '#F3F2F1', borderRadius: 1, overflow: 'hidden' }}>
                                  <Box sx={{ width: walmartBarWidth, height: '100%', bgcolor: walmartColor }}></Box>
                                </Box>
                                <span style={{ color: walmartColor, fontWeight: 600, minWidth: 45 }}>{customer.walmartPercent}%</span>
                              </Box>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                              <span style={{ color: ltlColor, fontWeight: 600 }}>{ltlVariance}</span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                                {healthStatus.status === 'healthy' && customer.strategicInsights.includes('✓') ? (
                                  <Typography variant="caption" sx={{ color: '#107C10', fontWeight: 600, fontSize: '11px' }}>
                                    ✓ On target
                                  </Typography>
                                ) : (
                                  customer.strategicInsights.map((badge, badgeIdx) => {
                                    const badgeDetails = getBadgeDetails(badge)
                                    return (
                                      <Tooltip key={badgeIdx} title={badgeDetails.tooltip} arrow>
                                        <Box sx={{
                                          width: 20,
                                          height: 20,
                                          bgcolor: badgeDetails.color,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          cursor: 'help',
                                          fontSize: '10px',
                                          fontWeight: 700,
                                          color: 'white',
                                          borderRadius: '2px'
                                        }}>
                                          {badge}
                                        </Box>
                                      </Tooltip>
                                    )
                                  })
                                )}
                              </Box>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                              {customer.hasAIRecommendation && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleAIClick(aiRecommendations[customer.name] ? { name: customer.name, ...aiRecommendations[customer.name] } : null)}
                                  sx={{ color: '#FFB900' }}
                                >
                                  <LightbulbIcon fontSize="small" />
                                </IconButton>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </Box>
              </Box>

            </Box>
          </Box>
          ) : (
            // Customer Detail View
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#f5f5f5',
              overflow: 'hidden'
            }}>
              {/* Header with Back Button */}
              <Box sx={{
                p: 2,
                bgcolor: 'white',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <IconButton
                  onClick={handleBackToScorecard}
                  sx={{
                    color: '#0078D4',
                    '&:hover': { bgcolor: 'rgba(0, 120, 212, 0.08)' }
                  }}
                >
                  <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px', color: '#323130' }}>
                    {selectedCustomerDetail?.name} - Customer Detail
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#605E5C' }}>
                    Rate analysis and recommendations
                  </Typography>
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: '#f5f5f5' }}>
                {selectedCustomerDetail && (
                  <>
                    {/* KPI Cards - Power BI Style */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2.5, mb: 3 }}>

                      {/* Conditional KPI Cards based on customer type */}
                      {selectedCustomerDetail.type === 'summary' ? (
                        <>
                          {/* Margin / Pallet Card */}
                          <Box sx={{
                            bgcolor: 'white',
                            p: 3,
                            borderRadius: '4px',
                            boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                            borderLeft: '4px solid #0078D4',
                            transition: 'box-shadow 0.3s',
                            '&:hover': {
                              boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                            }
                          }}>
                            <Typography variant="caption" sx={{
                              color: '#8A8886',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'block',
                              mb: 1.5
                            }}>
                              Margin / Pallet
                            </Typography>
                            <Typography sx={{
                              fontSize: '36px',
                              fontWeight: 600,
                              color: '#323130',
                              lineHeight: 1,
                              mb: 1
                            }}>
                              {selectedCustomerDetail.marginPerPallet}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5 }}>
                              Above industry benchmark
                            </Typography>
                            <Box sx={{ width: '100%', height: 6, bgcolor: '#EDEBE9', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                              <Box sx={{ width: '85%', height: '100%', bgcolor: '#107C10' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#107C10', fontWeight: 600, fontSize: '13px' }}>
                              ▲ Strong margin performance
                            </Typography>
                          </Box>

                          {/* Margin % Card */}
                          <Box sx={{
                            bgcolor: 'white',
                            p: 3,
                            borderRadius: '4px',
                            boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                            borderLeft: '4px solid #107C10',
                            transition: 'box-shadow 0.3s',
                            '&:hover': {
                              boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                            }
                          }}>
                            <Typography variant="caption" sx={{
                              color: '#8A8886',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'block',
                              mb: 1.5
                            }}>
                              Margin %
                            </Typography>
                            <Typography sx={{
                              fontSize: '36px',
                              fontWeight: 600,
                              color: '#107C10',
                              lineHeight: 1,
                              mb: 1
                            }}>
                              {selectedCustomerDetail.marginPercent}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5 }}>
                              vs. 15.5% avg benchmark
                            </Typography>
                            <Box sx={{ width: '100%', height: 6, bgcolor: '#EDEBE9', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                              <Box sx={{ width: '100%', height: '100%', bgcolor: '#107C10' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#107C10', fontWeight: 600, fontSize: '13px' }}>
                              ▲ Significantly above average
                            </Typography>
                          </Box>

                          {/* # of Pallets Card */}
                          <Box sx={{
                            bgcolor: 'white',
                            p: 3,
                            borderRadius: '4px',
                            boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                            borderLeft: '4px solid #8A8886',
                            transition: 'box-shadow 0.3s',
                            '&:hover': {
                              boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                            }
                          }}>
                            <Typography variant="caption" sx={{
                              color: '#8A8886',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'block',
                              mb: 1.5
                            }}>
                              # of Pallets
                            </Typography>
                            <Typography sx={{
                              fontSize: '36px',
                              fontWeight: 600,
                              color: '#323130',
                              lineHeight: 1,
                              mb: 1
                            }}>
                              {selectedCustomerDetail.numPallets}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5 }}>
                              Annual volume
                            </Typography>
                            <Box sx={{ width: '100%', height: 6, bgcolor: '#EDEBE9', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                              <Box sx={{ width: '90%', height: '100%', bgcolor: '#0078D4' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#0078D4', fontWeight: 600, fontSize: '13px' }}>
                              High-volume strategic account
                            </Typography>
                          </Box>

                          {/* Potential Monthly Impact Card */}
                          <Box sx={{
                            bgcolor: 'white',
                            p: 3,
                            borderRadius: '4px',
                            boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                            borderLeft: '4px solid #FFB900',
                            transition: 'box-shadow 0.3s',
                            '&:hover': {
                              boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                            }
                          }}>
                            <Typography variant="caption" sx={{
                              color: '#8A8886',
                              fontSize: '11px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              display: 'block',
                              mb: 1.5
                            }}>
                              Potential Monthly Impact
                            </Typography>
                            <Typography sx={{
                              fontSize: '36px',
                              fontWeight: 600,
                              color: '#FFB900',
                              lineHeight: 1,
                              mb: 1
                            }}>
                              {selectedCustomerDetail.potentialMonthlyImpact}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5 }}>
                              Expansion opportunity
                            </Typography>
                            <Box sx={{ width: '100%', height: 6, bgcolor: '#EDEBE9', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                              <Box sx={{ width: '70%', height: '100%', bgcolor: '#FFB900' }}></Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#FFB900', fontWeight: 600, fontSize: '13px' }}>
                              ⬆ Growth potential identified
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <>
                      {/* Avg Pallet Rate Card (for non-summary customers) */}
                      <Box sx={{
                        bgcolor: 'white',
                        p: 3,
                        borderRadius: '4px',
                        boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                        borderLeft: '4px solid #0078D4',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                        }
                      }}>
                        <Typography variant="caption" sx={{
                          color: '#8A8886',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          mb: 1.5
                        }}>
                          Avg Pallet Rate
                        </Typography>
                        <Typography sx={{
                          fontSize: '36px',
                          fontWeight: 600,
                          color: '#323130',
                          lineHeight: 1,
                          mb: 1
                        }}>
                          {selectedCustomerDetail.currentPalletRate}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5 }}>
                          vs. $38.20 market avg
                        </Typography>
                        <Box sx={{ width: '100%', height: 6, bgcolor: '#EDEBE9', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                          <Box sx={{ width: '72%', height: '100%', bgcolor: '#0078D4' }}></Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#8A8886', fontSize: '12px', display: 'block', mb: 1.5 }}>
                          72nd percentile in lane
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#107C10', fontWeight: 600, fontSize: '13px' }}>
                          ▲ Up $4.30 vs. Q3
                        </Typography>
                      </Box>

                      {/* Potential Impact Card */}
                      <Box sx={{
                        bgcolor: 'white',
                        p: 3,
                        borderRadius: '4px',
                        boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                        borderLeft: '4px solid #107C10',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                        }
                      }}>
                        <Typography variant="caption" sx={{
                          color: '#8A8886',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          mb: 1.5
                        }}>
                          Potential Monthly Impact
                        </Typography>
                        <Typography sx={{
                          fontSize: '36px',
                          fontWeight: 600,
                          color: '#107C10',
                          lineHeight: 1,
                          mb: 1
                        }}>
                          +$2,458
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 0.5 }}>
                          Transport + warehouse combined
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8A8886', fontSize: '12px', display: 'block', mb: 1.5 }}>
                          $1,923 transport / $535 warehouse
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#107C10', fontWeight: 600, fontSize: '13px' }}>
                          ▲ Revenue opportunity identified
                        </Typography>
                      </Box>

                      {/* Total Pallet Lanes Card */}
                      <Box sx={{
                        bgcolor: 'white',
                        p: 3,
                        borderRadius: '4px',
                        boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                        borderLeft: '4px solid #8A8886',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                        }
                      }}>
                        <Typography variant="caption" sx={{
                          color: '#8A8886',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          mb: 1.5
                        }}>
                          Total Pallet Lanes
                        </Typography>
                        <Typography sx={{
                          fontSize: '36px',
                          fontWeight: 600,
                          color: '#323130',
                          lineHeight: 1,
                          mb: 1
                        }}>
                          {selectedCustomerDetail.palletLanes.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5 }}>
                          Active routes
                        </Typography>
                        <Box sx={{ width: '100%', height: 6, bgcolor: '#EDEBE9', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                          <Box sx={{ width: '40%', height: '100%', bgcolor: '#8A8886' }}></Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#8A8886', fontSize: '12px', display: 'block', mb: 1.5 }}>
                          4 of 10 possible lanes active
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8A8886', fontWeight: 600, fontSize: '13px' }}>
                          — Unchanged from Q3
                        </Typography>
                      </Box>

                      {/* Warehouse Locations Card */}
                      <Box sx={{
                        bgcolor: 'white',
                        p: 3,
                        borderRadius: '4px',
                        boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                        borderLeft: '4px solid #8A8886',
                        transition: 'box-shadow 0.3s',
                        '&:hover': {
                          boxShadow: '0 3.2px 7.2px rgba(0,0,0,0.15), 0 0.6px 1.8px rgba(0,0,0,0.13)'
                        }
                      }}>
                        <Typography variant="caption" sx={{
                          color: '#8A8886',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block',
                          mb: 1.5
                        }}>
                          Warehouse Locations
                        </Typography>
                        <Typography sx={{
                          fontSize: '36px',
                          fontWeight: 600,
                          color: '#323130',
                          lineHeight: 1,
                          mb: 1
                        }}>
                          {selectedCustomerDetail.warehouseRates.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#605E5C', fontSize: '13px', mb: 1.5 }}>
                          Active facilities
                        </Typography>
                        <Box sx={{ width: '100%', height: 6, bgcolor: '#EDEBE9', borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                          <Box sx={{ width: '25%', height: '100%', bgcolor: '#8A8886' }}></Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#8A8886', fontSize: '12px', display: 'block', mb: 1.5 }}>
                          2 of 8 regional facilities used
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#8A8886', fontWeight: 600, fontSize: '13px' }}>
                          — Unchanged from Q3
                        </Typography>
                      </Box>
                        </>
                      )}
                    </Box>

                    {/* Recommendation Bar */}
                    <Box sx={{
                      mb: 3,
                      bgcolor: 'white',
                      p: 2.5,
                      borderRadius: '4px',
                      boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                      borderLeft: '4px solid #FFB900',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2
                    }}>
                      <LightbulbIcon sx={{ color: '#FFB900', fontSize: 24, mt: 0.25 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                          <Typography variant="subtitle2" sx={{
                            fontWeight: 600,
                            color: '#323130',
                            fontSize: '13px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Our Recommendation
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setRecommendationExpanded(!recommendationExpanded)}
                            sx={{ color: '#605E5C' }}
                          >
                            {recommendationExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{
                          color: '#323130',
                          lineHeight: 1.6,
                          fontSize: '14px'
                        }}>
                          {recommendationExpanded
                            ? selectedCustomerDetail.suggestion
                            : (
                              <>
                                {selectedCustomerDetail.suggestion.split('.')[0] + '... '}
                                <Box
                                  component="span"
                                  onClick={() => setRecommendationExpanded(true)}
                                  sx={{
                                    color: '#0078D4',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    '&:hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  See more
                                </Box>
                              </>
                            )
                          }
                        </Typography>
                      </Box>
                    </Box>

                    {/* Pallet Lanes Table */}
                    <Box sx={{
                      mb: 3,
                      bgcolor: 'white',
                      borderRadius: '4px',
                      boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ p: 2.5, borderBottom: '1px solid #E1E1E1' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#323130', fontSize: '16px' }}>
                          Pallet Lanes Analysis
                        </Typography>
                      </Box>
                      <Box sx={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #E1E1E1', background: '#FAF9F8' }}>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>From</th>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pallets</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Rate</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested Rate</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Impact</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCustomerDetail.palletLanes.map((lane, idx) => {
                              const impact = lane.additionalRevenue || lane.savings;
                              const isPositive = impact && impact.startsWith('+');
                              const isNegative = impact && impact.startsWith('-');
                              const impactColor = isPositive ? '#107C10' : isNegative ? '#D13438' : '#323130';

                              return (
                                <tr key={idx} style={{ background: idx % 2 === 0 ? 'white' : '#FAFAFA', borderBottom: '1px solid #EDEBE9' }}>
                                  <td style={{ padding: '14px 16px', color: '#323130' }}>{lane.from}</td>
                                  <td style={{ padding: '14px 16px', color: '#323130' }}>{lane.to}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#323130', fontWeight: 600 }}>{lane.pallets}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#323130' }}>{lane.currentRate}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#0078D4', fontWeight: 600 }}>{lane.suggested}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: impactColor, fontWeight: 600 }}>{impact}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Box>
                    </Box>

                    {/* Warehouse Rates Table */}
                    <Box sx={{
                      mb: 3,
                      bgcolor: 'white',
                      borderRadius: '4px',
                      boxShadow: '0 1.6px 3.6px rgba(0,0,0,0.13), 0 0.3px 0.9px rgba(0,0,0,0.11)',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ p: 2.5, borderBottom: '1px solid #E1E1E1' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#323130', fontSize: '16px' }}>
                          Warehouse Rates
                        </Typography>
                      </Box>
                      <Box sx={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #E1E1E1', background: '#FAF9F8' }}>
                              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Rate</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested Rate</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Monthly</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested Monthly</th>
                              <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 600, color: '#605E5C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Impact</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCustomerDetail.warehouseRates.map((wh, idx) => {
                              const impact = wh.additionalRevenue;
                              const impactColor = impact && impact.startsWith('+') ? '#107C10' : '#323130';

                              return (
                                <tr key={idx} style={{ background: idx % 2 === 0 ? 'white' : '#FAFAFA', borderBottom: '1px solid #EDEBE9' }}>
                                  <td style={{ padding: '14px 16px', color: '#323130' }}>{wh.location}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#323130' }}>{wh.currentRate}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#0078D4', fontWeight: 600 }}>{wh.suggested}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#323130' }}>{wh.monthlyCost}</td>
                                  <td style={{ padding: '14px 16px', textAlign: 'right', color: '#323130' }}>{wh.suggestedCost}</td>
                                  {impact && <td style={{ padding: '14px 16px', textAlign: 'right', color: impactColor, fontWeight: 600 }}>{impact}</td>}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Box>
                    </Box>

                  </>
                )}
              </Box>
            </Box>
          )
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
              {messages.length === 0 ? 'New Quote' : "Justin's IL Consolidation Program"}
            </Typography>
            {messages.length > 0 && (
              <IconButton size="small" sx={{ color: '#666' }}>
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
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
            startIcon={messages.length === 0 ? (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: '#ffc107',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 }
                  }
                }}
              >
                1
              </Box>
            ) : null}
            endIcon={selectedClient ? <EditIcon /> : null}
            sx={{
              bgcolor: '#00446A',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#003350'
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
                  onClick={() => {
                    setEntryPoint('traditional')
                    setSelectedClient('Justins')
                  }}
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
                          <Typography variant="body2" sx={{ color: '#333', mb: message.showRatesPreview ? 2 : (message.showFinalizeButton ? 2 : 0) }}>
                            {message.text}
                          </Typography>
                          {message.showRatesPreview && (
                            <Box sx={{ mb: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0', width: 'calc(100% + 24px)', ml: '-12px', mr: '-12px' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2.5, color: '#333', fontSize: '15px' }}>
                                Current Rates
                              </Typography>
                              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, mb: 2.5 }}>
                                <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 1.5, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Warehouse Rates
                                  </Typography>
                                  {editableRates.warehouseRates.map((rate, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ fontSize: '14px', color: '#333', mb: 0.75, lineHeight: 1.6 }}>
                                      {rate.location}: ${rate.rate.toFixed(2)}/pallet/day
                                    </Typography>
                                  ))}
                                </Box>
                                <Box>
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 1.5, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Channel Rates
                                  </Typography>
                                  {editableRates.channelRates.map((rate, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ fontSize: '14px', color: '#333', mb: 0.75, lineHeight: 1.6 }}>
                                      {rate.channel}: ${rate.ratePerPallet.toFixed(2)}/pallet
                                    </Typography>
                                  ))}
                                </Box>
                              </Box>
                              <Button
                                variant="outlined"
                                onClick={handleOpenAdjustRates}
                                sx={{
                                  textTransform: 'none',
                                  borderColor: '#F57C00',
                                  color: '#F57C00',
                                  '&:hover': {
                                    borderColor: '#E65100',
                                    bgcolor: '#FFF3E0'
                                  }
                                }}
                              >
                                Adjust Rates
                              </Button>
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

                  <Stack direction="row" spacing={2} flexWrap="wrap">
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
                    <Button
                      variant="contained"
                      onClick={handleDecisionButton3}
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
                      3. Use Default Logic To Calculate
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

                  {/* Current Rates Preview */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#00446A' }}>
                      Current Rates
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 1 }}>
                          Warehouse Rates
                        </Typography>
                        {editableRates.warehouseRates.map((rate, idx) => (
                          <Typography key={idx} variant="body2" sx={{ fontSize: '13px', color: '#333', mb: 0.5 }}>
                            {rate.location}: ${rate.rate.toFixed(2)}/pallet/day
                          </Typography>
                        ))}
                      </Box>
                      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#666', display: 'block', mb: 1 }}>
                          Channel Rates
                        </Typography>
                        {editableRates.channelRates.map((rate, idx) => (
                          <Typography key={idx} variant="body2" sx={{ fontSize: '13px', color: '#333', mb: 0.5 }}>
                            {rate.channel}: ${rate.ratePerPallet.toFixed(2)}/pallet
                          </Typography>
                        ))}
                      </Box>
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
                          Do you agree with these pricing factors and rates?
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block', lineHeight: 1.6 }}>
                          The factors and rates shown above will determine the pricing in your quote.
                          If you need adjustments, use the Adjust Rates button below.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ pt: 3, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleOpenAdjustRates}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#F57C00',
                        color: '#F57C00',
                        padding: '12px 20px',
                        fontSize: '16px',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#E65100',
                          bgcolor: '#FFF3E0'
                        }
                      }}
                    >
                      Adjust Rates
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setQuoteDetailLevel('standard')
                        handleGenerateQuote()
                      }}
                      sx={{
                        flex: 1,
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
                      Generate Standard Quote
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setQuoteDetailLevel('detailed')
                        handleGenerateQuote()
                      }}
                      sx={{
                        flex: 1,
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
                      Generate Detailed Quote
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
              {((currentStep === 0 && selectedClient) || currentStep === 2) && !quoteGenerated && (
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

            <Box sx={{ position: 'relative', flex: 1 }}>
              {messages.length === 0 && !selectedClient && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: '#ffc107',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    zIndex: 1,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1 },
                      '50%': { opacity: 0.5 }
                    }
                  }}
                >
                  2
                </Box>
              )}
              <TextField
                fullWidth
                placeholder="Begin describing your quote here."
                variant="outlined"
                size="small"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onFocus={() => {
                  if (!chatInput && messages.length === 0) {
                    setChatInput("I need to put together a quote for Justin's IL Consolidation Program — can you pull the details from the CRM?")
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim() && messages.length === 0) {
                    handleChatEntryPoint()
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'white',
                    paddingLeft: messages.length === 0 && !selectedClient ? '42px' : undefined
                  }
                }}
              />
            </Box>

            <IconButton
              onClick={() => {
                if (chatInput.trim() && messages.length === 0) {
                  handleChatEntryPoint()
                }
              }}
              disabled={!chatInput.trim() || messages.length > 0}
              sx={{
                bgcolor: chatInput.trim() && messages.length === 0 ? '#00446A' : '#e0e0e0',
                color: chatInput.trim() && messages.length === 0 ? 'white' : 'inherit',
                '&:hover': {
                  bgcolor: chatInput.trim() && messages.length === 0 ? '#003350' : '#d0d0d0'
                },
                '&.Mui-disabled': {
                  bgcolor: '#e0e0e0'
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

      {/* Customer Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={handleViewCustomerDetail}>
          <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: '#0078D4' }} />
          View Customer Detail
        </MenuItem>
      </Menu>

      {/* AI Recommendation Modal */}
      <Dialog
        open={aiModalOpen}
        onClose={handleAIClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#FFFBF0', borderBottom: '1px solid #E1E1E1', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LightbulbIcon sx={{ color: '#FFB900', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#323130' }}>
              Pricing Model Overview
            </Typography>
            {selectedAIClient && (
              <Typography variant="caption" sx={{ color: '#605E5C' }}>
                {selectedAIClient.name}
              </Typography>
            )}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedAIClient && (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#323130', mb: 1 }}>
                {selectedAIClient.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#605E5C', mb: 2, lineHeight: 1.6 }}>
                {selectedAIClient.recommendation}
              </Typography>
              <Box sx={{ bgcolor: '#F3F2F1', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#323130', mb: 0.5 }}>
                  Potential Impact
                </Typography>
                <Typography variant="body2" sx={{ color: '#107C10', fontWeight: 600 }}>
                  {selectedAIClient.potential}
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#323130', mb: 1 }}>
                Recommended Actions
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {selectedAIClient.actions.map((action, idx) => (
                  <Typography component="li" key={idx} variant="body2" sx={{ color: '#605E5C', mb: 0.5 }}>
                    {action}
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E1E1E1' }}>
          <Button onClick={handleAIClose} variant="contained" sx={{ bgcolor: '#0078D4', textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Rates Modal */}
      <Dialog
        open={adjustRatesModalOpen}
        onClose={handleCloseAdjustRates}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
            Adjust Rates
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#555' }}>
              Warehouse Rates ($/pallet/day)
            </Typography>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', bgcolor: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>Location</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#666' }}>Rate ($/pallet/day)</th>
                  </tr>
                </thead>
                <tbody>
                  {editableRates.warehouseRates.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < editableRates.warehouseRates.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                      <td style={{ padding: '10px 16px', fontSize: '13px' }}>{item.location}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <TextField
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleRateChange('warehouse', idx, e.target.value)}
                          size="small"
                          sx={{
                            width: 100,
                            '& input': { textAlign: 'right', fontSize: '13px', padding: '6px 10px' },
                            '& .MuiOutlinedInput-root': { height: 32 }
                          }}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 0.5, color: '#666', fontSize: '13px' }}>$</Typography>
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#555' }}>
              Channel-Specific Lane Rates
            </Typography>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', bgcolor: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>Channel</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#666' }}>Rate per Pallet</th>
                  </tr>
                </thead>
                <tbody>
                  {editableRates.channelRates.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < editableRates.channelRates.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                      <td style={{ padding: '10px 16px', fontSize: '13px' }}>{item.channel}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <TextField
                          type="number"
                          value={item.ratePerPallet}
                          onChange={(e) => handleRateChange('channel', idx, e.target.value)}
                          size="small"
                          sx={{
                            width: 100,
                            '& input': { textAlign: 'right', fontSize: '13px', padding: '6px 10px' },
                            '& .MuiOutlinedInput-root': { height: 32 }
                          }}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 0.5, color: '#666', fontSize: '13px' }}>$</Typography>
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0', gap: 1 }}>
          <Button
            onClick={handleCloseAdjustRates}
            sx={{ textTransform: 'none', color: '#666' }}
          >
            Cancel
          </Button>
          {quoteGenerated && ratesChanged ? (
            <Button
              variant="contained"
              onClick={handleRegenerateQuote}
              sx={{
                bgcolor: '#F57C00',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#E65100'
                }
              }}
            >
              Regenerate Quote
            </Button>
          ) : quoteGenerated ? (
            <Button
              variant="contained"
              onClick={handleFinalizeFromModal}
              sx={{
                bgcolor: '#F57C00',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#E65100'
                }
              }}
            >
              Regenerate Quote
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setAdjustRatesModalOpen(false)
                handleGenerateQuote()
              }}
              sx={{
                bgcolor: '#00446A',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#003350'
                }
              }}
            >
              Generate Quote
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default App
