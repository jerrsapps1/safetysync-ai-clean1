import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  User, 
  Building, 
  Users, 
  UserPlus,
  Check,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department: string;
  company?: string;
  type: 'internal';
}

interface ExternalStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position?: string;
  department?: string;
  type: 'external';
}

type StudentOption = Employee | ExternalStudent;

interface StudentAutocompleteProps {
  onSelect: (student: StudentOption) => void;
  selectedStudents: StudentOption[];
  placeholder?: string;
  className?: string;
}

export function StudentAutocomplete({ 
  onSelect, 
  selectedStudents, 
  placeholder = "Search employees and external students...",
  className = ""
}: StudentAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch employees (internal students)
  const { data: employees = [] } = useQuery({
    queryKey: ['/api/employees'],
    queryFn: async () => {
      const response = await fetch('/api/employees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      return data.map((emp: any) => ({
        ...emp,
        type: 'internal' as const
      }));
    }
  });

  // Search external students
  const { data: externalStudents = [] } = useQuery({
    queryKey: ['/api/external-students/search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const response = await fetch(`/api/external-students/search?q=${encodeURIComponent(debouncedQuery)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to search external students');
      const data = await response.json();
      return data.map((student: any) => ({
        ...student,
        type: 'external' as const
      }));
    },
    enabled: debouncedQuery.trim().length > 0
  });

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp: Employee) => {
    if (!debouncedQuery.trim()) return true;
    const query = debouncedQuery.toLowerCase();
    return (
      emp.firstName.toLowerCase().includes(query) ||
      emp.lastName.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.employeeId.toLowerCase().includes(query) ||
      emp.department.toLowerCase().includes(query)
    );
  });

  // Combine and filter results
  const allStudents: StudentOption[] = [
    ...filteredEmployees,
    ...externalStudents
  ];

  const availableStudents = allStudents.filter(student => 
    !selectedStudents?.some(selected => 
      selected.id === student.id && selected.type === student.type
    )
  );

  const handleSelect = (student: StudentOption) => {
    onSelect(student);
    setSearchQuery('');
    setOpen(false);
  };

  const getStudentDisplay = (student: StudentOption) => {
    const name = `${student.firstName} ${student.lastName}`;
    const company = student.type === 'internal' ? 'Internal Employee' : student.company;
    const identifier = student.type === 'internal' ? `ID: ${student.employeeId}` : student.email;
    
    return {
      name,
      company,
      identifier,
      department: student.department
    };
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {placeholder}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Type to search..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No students found.</CommandEmpty>
              
              {filteredEmployees.length > 0 && (
                <CommandGroup heading="Internal Employees">
                  {filteredEmployees.slice(0, 5).map((employee) => {
                    const display = getStudentDisplay(employee);
                    return (
                      <CommandItem
                        key={`internal-${employee.id}`}
                        value={`${employee.firstName} ${employee.lastName} ${employee.email}`}
                        onSelect={() => handleSelect(employee)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{display.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {display.identifier} • {display.department}
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Building className="h-3 w-3 mr-1" />
                            Internal
                          </Badge>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {externalStudents.length > 0 && (
                <CommandGroup heading="External Students">
                  {externalStudents.slice(0, 5).map((student) => {
                    const display = getStudentDisplay(student);
                    return (
                      <CommandItem
                        key={`external-${student.id}`}
                        value={`${student.firstName} ${student.lastName} ${student.email}`}
                        onSelect={() => handleSelect(student)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{display.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {display.identifier}
                                {display.department && ` • ${display.department}`}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <Building className="h-3 w-3 mr-1" />
                            {student.company}
                          </Badge>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}

              {availableStudents.length === 0 && debouncedQuery && (
                <div className="p-4 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No students found matching "{debouncedQuery}"</p>
                  <p className="text-sm">Try adjusting your search terms</p>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}