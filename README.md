# Bio-Next Frontend

A professional bioinformatics AI assistant with real-time conversation capabilities and data analysis features.

## Features

- **Professional Bioinformatics Agent**: Specialized AI assistant for computational biology
- **Real-time Conversation**: Interactive chat interface with intelligent responses
- **Analysis Detection**: Automatically detects when users need data analysis
- **File Upload Guidance**: Guides users to upload appropriate data files
- **Project Management**: Create and manage multiple analysis projects
- **Multi-language Support**: English interface with professional terminology
- **Cross-site Authentication**: Seamless login integration with CureNova website

## Cross-site Authentication

This application integrates with [CureNova Bioscience](https://cure-nova-website.vercel.app/) for seamless authentication. Users can:

1. **Login from CureNova**: Users logged into CureNova can access this application without re-authentication
2. **Automatic Session Transfer**: Login state is automatically transferred between sites
3. **Multiple Authentication Methods**: Supports URL parameters, localStorage, and API-based authentication

### How it works:

1. User logs in on CureNova website
2. User navigates to Bio-Next application
3. Authentication state is automatically detected and applied
4. User can use Bio-Next without re-logging in

### Supported Authentication Methods:

- **URL Parameters**: `?auth_token=xxx&user_data=xxx`
- **Local Storage**: `curenova-user` and `auth-token` keys
- **Session Storage**: Fallback for session-based storage
- **API Verification**: Direct API calls to CureNova authentication endpoint

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. API Configuration

The application is configured to use a custom API endpoint. The configuration is already set in `app/api/bio-llm/route.ts`:

```typescript
const CONFIG = {
  api_key: "sk-yILYHgBzpy4zlTKhfMa4fNpKV5ms9kIuReukJZhAsIHbZP5r",
  base_url: "https://sg.uiuiapi.com/v1",
  model: "o3-mini-2025-01-31"
}
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Code Optimization

The codebase has been optimized to eliminate redundancy:

### Removed Redundancies:
- **Session ID Generation**: Centralized in `lib/utils.ts`
- **Login Redirects**: Unified in `redirectToCureNovaLogin()` function
- **Authentication Hooks**: Merged `useAuth` and `useCureNovaAuth` into `useUnifiedAuth`
- **Cross-site Auth**: Dedicated utilities in `crossSiteAuth` object

### Key Improvements:
- **DRY Principle**: Eliminated duplicate code across components
- **Centralized Utils**: Common functions moved to `lib/utils.ts`
- **Unified Authentication**: Single hook handles all auth scenarios
- **Better Error Handling**: Improved error handling for cross-site auth

## Bioinformatics Analysis Types

### Supported Analysis Types:

1. **Sequence Analysis**
   - DNA/RNA sequence analysis
   - Quality control and preprocessing
   - Alignment and variant calling
   - Phylogenetic analysis

2. **Gene Expression Analysis**
   - RNA-seq data analysis
   - Differential expression analysis
   - Clustering and visualization
   - Pathway enrichment analysis

3. **Variant Analysis**
   - Whole genome sequencing
   - Exome sequencing
   - Structural variant detection
   - Population genetics

4. **Pathway Analysis**
   - Gene set enrichment analysis
   - Pathway visualization
   - Functional annotation
   - Network analysis

### Supported File Formats:

- **Sequence files**: FASTQ, FASTA, BAM, SAM, VCF
- **Expression data**: CSV, TSV, Excel files
- **Annotation files**: GFF, GTF, BED
- **Other formats**: JSON, XML, TXT

## Usage

### Starting a Conversation

1. Type your bioinformatics question or analysis request
2. The AI will detect if you need data analysis
3. If analysis is needed, you'll be prompted to upload files
4. Upload your data files using the attachment button
5. Get professional guidance and step-by-step instructions

### Example Queries

- "I need to analyze RNA-seq data for differential expression"
- "Can you help me with variant calling from BAM files?"
- "How do I perform pathway enrichment analysis?"
- "What tools should I use for single-cell RNA-seq analysis?"

## Project Structure

```
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ChatInterface.tsx  # Main chat interface
│   ├── MessageItem.tsx    # Individual message component
│   ├── Sidebar.tsx        # Project management sidebar
│   └── ...
├── lib/                   # Utility libraries
│   ├── bioLLM.ts         # LLM service integration
│   ├── bioPrompts.ts     # Professional prompts
│   └── utils.ts          # Common utilities (including auth)
├── hooks/                 # Custom React hooks
│   └── useAuth.ts        # Unified authentication hook
├── store/                 # State management
└── types/                 # TypeScript type definitions
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Custom LLM API**: o3-mini-2025-01-31 model
- **Lucide React**: Beautiful icons
- **Zustand**: Lightweight state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 