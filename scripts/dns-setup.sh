#!/bin/bash

# SafetySync.AI DNS Setup Script
# This script helps configure DNS records for SafetySync.AI deployment

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="safetysync.ai"
CONFIG_FILE="dns-records.json"

echo -e "${BLUE}=== SafetySync.AI DNS Configuration Setup ===${NC}"
echo

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    local deps=("dig" "curl" "jq")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing[*]}"
        echo "Please install missing dependencies and run again."
        exit 1
    fi
    
    print_status "All dependencies found!"
}

# Get server IP address
get_server_ip() {
    print_status "Getting server IP address..."
    
    # Try to get public IP
    local ip=$(curl -s https://api.ipify.org 2>/dev/null || curl -s https://checkip.amazonaws.com 2>/dev/null || echo "")
    
    if [ -z "$ip" ]; then
        print_warning "Could not automatically detect server IP"
        echo -n "Please enter your server IP address: "
        read -r ip
    else
        print_status "Detected server IP: $ip"
        echo -n "Is this correct? (y/n): "
        read -r confirm
        if [[ $confirm != [Yy]* ]]; then
            echo -n "Please enter your server IP address: "
            read -r ip
        fi
    fi
    
    echo "$ip"
}

# Validate IP address format
validate_ip() {
    local ip=$1
    local pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
    
    if [[ $ip =~ $pattern ]]; then
        return 0
    else
        return 1
    fi
}

# Generate DNS records
generate_dns_records() {
    local server_ip=$1
    print_status "Generating DNS records for $DOMAIN..."
    
    # Update the JSON configuration file
    if [ -f "$CONFIG_FILE" ]; then
        # Replace placeholder IP addresses
        sed -i.bak "s/YOUR_SERVER_IP/$server_ip/g" "$CONFIG_FILE"
        sed -i.bak "s/YOUR_STAGING_IP/$server_ip/g" "$CONFIG_FILE"
        sed -i.bak "s/YOUR_DEV_IP/$server_ip/g" "$CONFIG_FILE"
        
        print_status "DNS records configuration updated in $CONFIG_FILE"
    else
        print_error "DNS configuration file not found: $CONFIG_FILE"
        exit 1
    fi
}

# Display DNS records
display_dns_records() {
    print_status "DNS Records to configure:"
    echo
    
    if [ -f "$CONFIG_FILE" ]; then
        echo -e "${BLUE}A Records:${NC}"
        jq -r '.records[] | select(.type == "A") | "  \(.name) -> \(.value)"' "$CONFIG_FILE"
        echo
        
        echo -e "${BLUE}CNAME Records:${NC}"
        jq -r '.records[] | select(.type == "CNAME") | "  \(.name) -> \(.value)"' "$CONFIG_FILE"
        echo
        
        echo -e "${BLUE}TXT Records:${NC}"
        jq -r '.records[] | select(.type == "TXT") | "  \(.name) -> \(.value)"' "$CONFIG_FILE"
        echo
        
        echo -e "${BLUE}MX Records:${NC}"
        jq -r '.records[] | select(.type == "MX") | "  \(.name) -> \(.value) (Priority: \(.priority))"' "$CONFIG_FILE"
        echo
    fi
}

# Test DNS resolution
test_dns_resolution() {
    local domain=$1
    print_status "Testing DNS resolution for $domain..."
    
    local subdomains=("app" "api" "admin" "www")
    
    for subdomain in "${subdomains[@]}"; do
        local full_domain="$subdomain.$domain"
        echo -n "  Testing $full_domain... "
        
        if dig +short "$full_domain" >/dev/null 2>&1; then
            echo -e "${GREEN}OK${NC}"
        else
            echo -e "${RED}FAIL${NC}"
        fi
    done
}

# Generate SSL certificate commands
generate_ssl_commands() {
    local domain=$1
    print_status "SSL Certificate setup commands:"
    echo
    
    echo -e "${BLUE}For Let's Encrypt (using certbot):${NC}"
    echo "  sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials ~/.secrets/cloudflare.ini -d $domain -d *.$domain"
    echo
    
    echo -e "${BLUE}For manual certificate:${NC}"
    echo "  openssl req -new -newkey rsa:2048 -nodes -keyout $domain.key -out $domain.csr"
    echo
}

# Generate zone file
generate_zone_file() {
    local domain=$1
    local server_ip=$2
    local zone_file="${domain}.zone"
    
    print_status "Generating BIND zone file: $zone_file"
    
    cat > "$zone_file" << EOF
\$TTL 300
@   IN  SOA ns1.$domain. admin.$domain. (
    $(date +%Y%m%d%H) ; Serial
    3600        ; Refresh
    1800        ; Retry
    604800      ; Expire
    300         ; Minimum TTL
)

; Name servers
@   IN  NS  ns1.$domain.
@   IN  NS  ns2.$domain.

; A records
@       IN  A   $server_ip
app     IN  A   $server_ip
api     IN  A   $server_ip
admin   IN  A   $server_ip
staging IN  A   $server_ip
dev     IN  A   $server_ip

; CNAME records
www     IN  CNAME   @
docs    IN  CNAME   app
blog    IN  CNAME   app

; MX record
@       IN  MX  10  mail.$domain.

; TXT records
@       IN  TXT "v=spf1 include:_spf.google.com ~all"
_dmarc  IN  TXT "v=DMARC1; p=quarantine; rua=mailto:admin@$domain"

; CAA records
@       IN  CAA 0 issue "letsencrypt.org"
@       IN  CAA 0 iodef "mailto:admin@$domain"
EOF

    print_status "Zone file generated: $zone_file"
}

# Main execution
main() {
    echo -e "${BLUE}SafetySync.AI DNS Setup Wizard${NC}"
    echo "This script will help you configure DNS records for SafetySync.AI"
    echo
    
    # Check dependencies
    check_dependencies
    
    # Get server IP
    SERVER_IP=$(get_server_ip)
    
    # Validate IP
    if ! validate_ip "$SERVER_IP"; then
        print_error "Invalid IP address format: $SERVER_IP"
        exit 1
    fi
    
    # Generate DNS records
    generate_dns_records "$SERVER_IP"
    
    # Display records
    display_dns_records
    
    # Generate zone file
    generate_zone_file "$DOMAIN" "$SERVER_IP"
    
    # Generate SSL commands
    generate_ssl_commands "$DOMAIN"
    
    echo
    print_status "DNS configuration complete!"
    echo
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Configure these DNS records with your DNS provider"
    echo "2. Wait for DNS propagation (24-48 hours)"
    echo "3. Set up SSL certificates"
    echo "4. Test all endpoints"
    echo "5. Configure monitoring and alerts"
    echo
    echo -e "${BLUE}Files generated:${NC}"
    echo "  - $CONFIG_FILE (updated with your IP)"
    echo "  - ${DOMAIN}.zone (BIND zone file)"
    echo
    
    # Offer to test DNS
    echo -n "Would you like to test DNS resolution now? (y/n): "
    read -r test_confirm
    if [[ $test_confirm == [Yy]* ]]; then
        test_dns_resolution "$DOMAIN"
    fi
}

# Run main function
main "$@"