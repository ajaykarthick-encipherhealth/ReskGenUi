import React from 'react';
import { render, screen } from '@testing-library/react';
import { getFlag } from '../../src/components/reuseableFunctions/index'; 
import visitStyles from '../../src/styles/visitdata.module.css'; 
import { getFlags } from '../../src/components/reuseableFunctions/index'; 
import { renderSkeletonHold } from '../../src/components/reuseableFunctions/index'; 
import { Skeleton } from "antd";



describe('getFlag function', () => {
  const renderFlagComponent = (flag) => {
    const TestComponent = getFlag({ flags: flag });
    render(<>{TestComponent}</>);
  };

  test('renders "Patient name missed" flag correctly', () => {
    renderFlagComponent("PATIENT_NAME_MISSED");

    expect(screen.getByText('Patient name missed')).toBeInTheDocument();
    expect(screen.getByText('Patient name missed').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('Patient name missed')).toHaveStyle('font-size: 12px');
  });

  test('renders "Patient dob missed" flag correctly', () => {
    renderFlagComponent("PATIENT_DOB_MISSED");
  
    expect(screen.getByText('Patient dob missed')).toBeInTheDocument();
    expect(screen.getByText('Patient dob missed').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('Patient dob missed')).toHaveStyle('font-size: 12px');
  });
  test('renders "MRN id Mismatch" flag correctly', () => {
    renderFlagComponent("MRN_ID_MISMATCH");
  
    expect(screen.getByText('MRN id Mismatch')).toBeInTheDocument();
    expect(screen.getByText('MRN id Mismatch').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('MRN id Mismatch')).toHaveStyle('font-size: 12px');
  });
  test('renders "Provider Sign Missed" flag correctly', () => {
    renderFlagComponent("PROVIDER_SIGN_MISSED");
  
    expect(screen.getByText('Provider Sign Missed')).toBeInTheDocument();
    expect(screen.getByText('Provider Sign Missed').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('Provider Sign Missed')).toHaveStyle('font-size: 12px');
  });
  test('renders "Provider Signature Missed" flag correctly', () => {
    renderFlagComponent("PROVIDER_SIGNATURE_MISSED");
  
    expect(screen.getByText('Provider Signature Missed')).toBeInTheDocument();
    expect(screen.getByText('Provider Signature Missed').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('Provider Signature Missed')).toHaveStyle('font-size: 12px');
  });
  test('renders "Provider Credential Missed" flag correctly', () => {
    renderFlagComponent("PROVIDER_CREDENTIAL_MISSED");
  
    expect(screen.getByText('Provider Credential Missed')).toBeInTheDocument();
    expect(screen.getByText('Provider Credential Missed').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('Provider Credential Missed')).toHaveStyle('font-size: 12px');
  });
  test('renders "Provider Sign Status Pending" flag correctly', () => {
    renderFlagComponent("PROVIDER_SIGN_STATUS_PENDING");
  
    expect(screen.getByText('Provider Sign Status Pending')).toBeInTheDocument();
    expect(screen.getByText('Provider Sign Status Pending').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('Provider Sign Status Pending')).toHaveStyle('font-size: 12px');
  });
  test('renders "No HCC Found" flag correctly', () => {
    renderFlagComponent("NO_HCC_FOUND");
  
    expect(screen.getByText('No HCC Found')).toBeInTheDocument();
    expect(screen.getByText('No HCC Found').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('No HCC Found')).toHaveStyle('font-size: 12px');
  });
  test('renders "None" flag correctly', () => {
    renderFlagComponent("");
  
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('None').closest('div')).toHaveClass(visitStyles.name_missed);
    expect(screen.getByText('None')).toHaveStyle('font-size: 12px');
  });

  it('should return null when data is undefined', () => {
    const result = getFlags(undefined);
    expect(result).toBeNull();
  });
  it("returns null when data does not contain the year 2023", () => {
    const data = { "2022": [{ flag: "PATIENT_NAME_MISSED" }] };
    expect(getFlags(data)).toBeNull();
  });
 

  it("renders the skeleton table with a header and six rows", () => {
    const { container } = render(renderSkeletonHold());
    const skeletonTable = container.querySelector(".skeleton-table");
    expect(skeletonTable).toBeInTheDocument();
    const skeletonHeader = container.querySelector(".skeleton-header .ant-skeleton-input");
    expect(skeletonHeader).toBeInTheDocument();
    expect(skeletonHeader).toHaveStyle({ width: "510px" });
    const skeletonRows = container.querySelectorAll(".skeleton-row .ant-skeleton-input");
    expect(skeletonRows.length).toBe(6);
    skeletonRows.forEach((row) => {
      expect(row).toHaveStyle({ width: "510px" });
      expect(row).toHaveClass("ant-skeleton-input");
    });
  });
  
 
});
