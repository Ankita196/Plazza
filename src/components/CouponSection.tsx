import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CouponRule } from '../types';
import { CouponRegistry } from '../services/couponRules';

interface Props {
  appliedCouponCode: string | null;
  itemTotal: number;
  isFirstOrder: boolean;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
}

export const CouponSection: React.FC<Props> = ({
  appliedCouponCode,
  itemTotal,
  isFirstOrder,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [inputCode, setInputCode] = useState('');
  const allCoupons = CouponRegistry.getAllRules();

  const handleApplyCustom = () => {
    if (inputCode.trim()) {
      onApplyCoupon(inputCode.trim().toUpperCase());
      setInputCode('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PROMOTIONS & COUPONS</Text>

      {/* Manual Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputCode}
          onChangeText={setInputCode}
          placeholder="Enter coupon code (e.g. FLAT50)"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          accessibilityLabel="Enter coupon code"
        />
        <TouchableOpacity
          style={[styles.applyBtn, !inputCode.trim() && styles.applyBtnDisabled]}
          onPress={handleApplyCustom}
          disabled={!inputCode.trim()}
          accessibilityRole="button"
          accessibilityLabel="Apply entered coupon"
        >
          <Text style={styles.applyBtnText}>APPLY</Text>
        </TouchableOpacity>
      </View>

      {/* Available Coupon Cards */}
      <View style={styles.couponsList}>
        {allCoupons.map((rule: CouponRule) => {
          const isApplied = appliedCouponCode === rule.code;
          const validation = rule.validate({ itemTotal, items: [], isFirstOrder });
          const isEligible = validation.isValid;

          return (
            <View
              key={rule.code}
              style={[
                styles.couponCard,
                isApplied && styles.couponCardApplied,
                !isEligible && !isApplied && styles.couponCardIneligible,
              ]}
              accessibilityRole="text"
              accessibilityLabel={`Coupon ${rule.code}: ${rule.description}`}
            >
              <View style={styles.couponLeft}>
                <View style={styles.codeRow}>
                  <View style={[styles.codeBadge, isApplied && styles.codeBadgeApplied]}>
                    <Text style={[styles.codeText, isApplied && styles.codeTextApplied]}>
                      {rule.code}
                    </Text>
                  </View>
                  {isApplied && (
                    <Text style={styles.appliedTag}>✓ APPLIED</Text>
                  )}
                </View>
                <Text style={styles.couponTitle}>{rule.title}</Text>
                <Text style={styles.couponDesc}>{rule.description}</Text>
                {!isEligible && !isApplied && validation.reason && (
                  <Text style={styles.ineligibleReason}>{validation.reason}</Text>
                )}
              </View>

              <View style={styles.couponRight}>
                {isApplied ? (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={onRemoveCoupon}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${rule.code} coupon`}
                  >
                    <Text style={styles.removeBtnText}>REMOVE</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.selectBtn, !isEligible && styles.selectBtnDisabled]}
                    onPress={() => onApplyCoupon(rule.code)}
                    accessibilityRole="button"
                    accessibilityLabel={`Apply ${rule.code} coupon`}
                  >
                    <Text
                      style={[
                        styles.selectBtnText,
                        !isEligible && styles.selectBtnTextDisabled,
                      ]}
                    >
                      APPLY
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#0D9488',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  couponsList: {
    gap: 8,
  },
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  couponCardApplied: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
  },
  couponCardIneligible: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  couponLeft: {
    flex: 1,
    paddingRight: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  codeBadge: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#38BDF8',
    borderStyle: 'dashed',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  codeBadgeApplied: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  codeText: {
    color: '#0369A1',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  codeTextApplied: {
    color: '#15803D',
  },
  appliedTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A',
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  couponDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  ineligibleReason: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: 4,
    fontWeight: '500',
  },
  couponRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBtn: {
    borderWidth: 1.5,
    borderColor: '#0D9488',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  selectBtnDisabled: {
    borderColor: '#CBD5E1',
  },
  selectBtnText: {
    color: '#0D9488',
    fontWeight: '800',
    fontSize: 12,
  },
  selectBtnTextDisabled: {
    color: '#94A3B8',
  },
  removeBtn: {
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 12,
  },
});
