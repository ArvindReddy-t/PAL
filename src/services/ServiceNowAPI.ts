export interface ServiceNowTicket {
  id: string;
  number: string;
  title: string;
  description: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Open' | 'In Progress' | 'Pending' | 'Resolved';
  assignedTo: string;
  createdDate: string;
  updatedDate: string;
  category: 'Incident' | 'Request' | 'Change';
}

export interface ServiceNowConfig {
  baseUrl: string | null;
  bearerToken: string | null;
}

export function calculateSLA(assignedTime: string, priority: string): { slaDue: Date, remaining: string } {
  const assignedDate = new Date(assignedTime);
  let slaMs = 0;
  if (priority.toLowerCase() === 'high' || priority === '1') {
    slaMs = 2 * 60 * 60 * 1000; // 2 hours
  } else if (priority.toLowerCase() === 'mid' || priority === '2') {
    slaMs = 48 * 60 * 60 * 1000; // 48 hours
  } else {
    slaMs = 5 * 24 * 60 * 60 * 1000; // 5 days
  }
  const slaDue = new Date(assignedDate.getTime() + slaMs);
  const now = new Date();
  let diff = slaDue.getTime() - now.getTime();
  if (diff < 0) diff = 0;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const days = Math.floor(hours / 24);
  const hr = hours % 24;
  let remaining = '';
  if (days > 0) remaining += `${days}d `;
  if (hr > 0) remaining += `${hr}h `;
  remaining += `${minutes}m`;
  return { slaDue, remaining };
}

class ServiceNowAPI {
  private config: ServiceNowConfig = {
    baseUrl: null,
    bearerToken: null
  };

  // Set configuration
  setConfig(baseUrl: string | null, bearerToken: string | null) {
    this.config = { baseUrl, bearerToken };
  }

  // Get current configuration
  getConfig(): ServiceNowConfig {
    return this.config;
  }

  // Check if API is configured
  isConfigured(): boolean {
    return !!(this.config.baseUrl && this.config.bearerToken);
  }

  // Fetch incidents from ServiceNow
  async fetchIncidents(): Promise<ServiceNowTicket[]> {
    if (!this.isConfigured()) {
      return this.getHardcodedIncidents();
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/now/table/incident?sysparm_query=state!=6^state!=7&sysparm_limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformServiceNowData(data.result, 'Incident');
    } catch (error) {
      console.error('Error fetching ServiceNow incidents:', error);
      return this.getHardcodedIncidents();
    }
  }

  // Fetch service requests from ServiceNow
  async fetchRequests(): Promise<ServiceNowTicket[]> {
    if (!this.isConfigured()) {
      return this.getHardcodedRequests();
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/now/table/sc_request?sysparm_query=state!=6^state!=7&sysparm_limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformServiceNowData(data.result, 'Request');
    } catch (error) {
      console.error('Error fetching ServiceNow requests:', error);
      return this.getHardcodedRequests();
    }
  }

  // Fetch change requests from ServiceNow
  async fetchChanges(): Promise<ServiceNowTicket[]> {
    if (!this.isConfigured()) {
      return this.getHardcodedChanges();
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/now/table/change_request?sysparm_query=state!=6^state!=7&sysparm_limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformServiceNowData(data.result, 'Change');
    } catch (error) {
      console.error('Error fetching ServiceNow changes:', error);
      return this.getHardcodedChanges();
    }
  }

  // Fetch all tickets
  async fetchAllTickets(): Promise<ServiceNowTicket[]> {
    const [incidents, requests, changes] = await Promise.all([
      this.fetchIncidents(),
      this.fetchRequests(),
      this.fetchChanges()
    ]);

    return [...incidents, ...requests, ...changes];
  }

  // Transform ServiceNow API response to our format
  private transformServiceNowData(data: Record<string, unknown>[], category: 'Incident' | 'Request' | 'Change'): ServiceNowTicket[] {
    return data.map((item, index) => ({
      id: String(item.sys_id || `api-${category}-${index}`),
      number: String(item.number || item.sys_id || `API${index}`),
      title: String(item.short_description || item.title || 'No title provided'),
      description: String(item.description || item.short_description || 'No description provided'),
      priority: this.mapPriority(String(item.priority)),
      status: this.mapStatus(String(item.state)),
      assignedTo: String((item.assigned_to as Record<string, unknown>)?.display_value || item.assigned_to || 'Unassigned'),
      createdDate: String(item.opened_at || item.created_on || new Date().toISOString()),
      updatedDate: this.formatTimeAgo(String(item.sys_updated_on || item.updated_on)),
      category
    }));
  }

  // Map ServiceNow priority to our format
  private mapPriority(priority: string): 'P1' | 'P2' | 'P3' | 'P4' {
    const priorityMap: { [key: string]: 'P1' | 'P2' | 'P3' | 'P4' } = {
      '1': 'P1',
      '2': 'P2',
      '3': 'P3',
      '4': 'P4',
      'critical': 'P1',
      'high': 'P2',
      'medium': 'P3',
      'low': 'P4'
    };
    return priorityMap[priority?.toLowerCase()] || 'P3';
  }

  // Map ServiceNow status to our format
  private mapStatus(state: string): 'Open' | 'In Progress' | 'Pending' | 'Resolved' {
    const statusMap: { [key: string]: 'Open' | 'In Progress' | 'Pending' | 'Resolved' } = {
      '1': 'Open',
      '2': 'In Progress',
      '3': 'Pending',
      '6': 'Resolved',
      '7': 'Resolved', // Map 'Closed' to 'Resolved'
      'new': 'Open',
      'in_progress': 'In Progress',
      'pending': 'Pending',
      'resolved': 'Resolved'
    };
    return statusMap[state?.toLowerCase()] || 'Open';
  }

  // Format time ago
  private formatTimeAgo(dateString: string): string {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  }

  // Hardcoded incidents for fallback
  private getHardcodedIncidents(): ServiceNowTicket[] {
    return [
      {
        id: "1",
        number: "INC0012345",
        title: "Network connectivity issues in Building A",
        description: "Multiple users reporting intermittent network connection drops in Building A, floors 3-5",
        priority: 'P1',
        status: 'Open',
        assignedTo: 'Network Team',
        createdDate: '2024-01-15',
        updatedDate: '2 hours ago',
        category: 'Incident'
      }
    ];
  }

  // Hardcoded requests for fallback
  private getHardcodedRequests(): ServiceNowTicket[] {
    return [
      {
        id: "2",
        number: "REQ0067890",
        title: "Software installation request - Adobe Creative Suite",
        description: "Request for Adobe Creative Suite installation for Marketing department",
        priority: 'P3',
        status: 'In Progress',
        assignedTo: 'IT Support',
        createdDate: '2024-01-14',
        updatedDate: '1 day ago',
        category: 'Request'
      }
    ];
  }

  // Hardcoded changes for fallback
  private getHardcodedChanges(): ServiceNowTicket[] {
    return [
      {
        id: "3",
        number: "CHG0004567",
        title: "Database maintenance window",
        description: "Scheduled maintenance for production database systems",
        priority: 'P2',
        status: 'Pending',
        assignedTo: 'Database Team',
        createdDate: '2024-01-13',
        updatedDate: '3 hours ago',
        category: 'Change'
      }
    ];
  }
}

// Export singleton instance
export const serviceNowAPI = new ServiceNowAPI(); 